import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MinioService, BufferedFile } from '../minio/minio.service';
import * as path from 'path';
import { randomUUID } from 'crypto';

export interface FileResponse {
  objectName: string;
  originalName: string;
  name: string;
  size: number;
  lastModified: Date;
  etag: string;
  isStarred: boolean;
  deletedAt?: Date | null;
}

function toFileResponse(f: any): FileResponse {
  return {
    objectName: f.objectName,
    originalName: f.originalName,
    name: f.displayName,
    size: f.size,
    lastModified: f.updatedAt,
    etag: f.etag ?? f.id,
    isStarred: f.isStarred ?? false,
  };
}

@Injectable()
export class FilesService {
  constructor(
    private readonly minio: MinioService,
    private readonly db: DatabaseService,
  ) {}

  async getAllFiles(
    userId: string,
    sortBy: 'name' | 'date' | 'size' = 'date',
    order: 'asc' | 'desc' = 'desc',
  ) {
    const orderBy: any = {};

    if (sortBy === 'name') {
      orderBy.displayName = order;
    } else if (sortBy === 'date') {
      orderBy.createdAt = order;
    } else if (sortBy === 'size') {
      orderBy.size = order;
    }

    const files = await this.db.file.findMany({
      where: { userId, deletedAt: null, isDeleted: false },
      orderBy,
    });

    return files.map(toFileResponse);
  }

  async getDeletedFiles(userId: string) {
    const files = await this.db.file.findMany({
      where: { userId, isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });

    return files.map((f) => ({
      ...toFileResponse(f),
      deletedAt: f.deletedAt,
    }));
  }

  async getStarredFiles(userId: string) {
    const [ownedFiles, sharedFiles] = await Promise.all([
      this.db.file.findMany({
        where: { userId, isStarred: true, isDeleted: false },
        orderBy: { createdAt: 'desc' },
      }),
      this.db.fileShare.findMany({
        where: {
          sharedWithId: userId,
          revokedAt: null,
          isStarred: true,
        },
        include: {
          file: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const owned = ownedFiles.map(toFileResponse);
    const shared = sharedFiles.map((s: any) => ({
      ...toFileResponse(s.file),
      isStarred: true,
      ownerName: s.file.user?.name || s.file.user?.email || 'Unknown',
    }));

    return [...owned, ...shared];
  }

  async searchFiles(userId: string, query: string) {
    const files = await this.db.file.findMany({
      where: {
        userId,
        deletedAt: null,
        isDeleted: false,
        OR: [
          { displayName: { contains: query, mode: 'insensitive' } },
          { originalName: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return files.map(toFileResponse);
  }

  async uploadFile(
    userId: string,
    file: BufferedFile,
    parentPath?: string,
  ) {
    const normalizedPath = this.normalizePath(parentPath);
    const objectName = this.buildObjectName(userId, normalizedPath, randomUUID());

    const result = await this.minio.uploadFile('data', file, objectName);

    const ext = path.extname(result.originalName).replace('.', '');

    const dbFile = await this.db.file.create({
      data: {
        bucket: 'data',
        objectName: result.objectName,
        originalName: result.originalName,
        displayName: `${normalizedPath}${result.originalName}`,
        size: result.size,
        mimeType: result.mimetype,
        extension: ext || null,
        userId,
      },
    });

    return toFileResponse(dbFile);
  }

  async softDeleteFile(userId: string, objectName: string) {
    const dbFile = await this.findUserFile(userId, objectName);

    await this.db.file.update({
      where: { id: dbFile.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return { success: true };
  }

  async restoreFile(userId: string, objectName: string) {
    const dbFile = await this.db.file.findFirst({
      where: { objectName, userId, isDeleted: true },
    });

    if (!dbFile) {
      throw new NotFoundException('File not found in trash');
    }

    await this.db.file.update({
      where: { id: dbFile.id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    return { success: true };
  }

  async permanentlyDeleteFile(userId: string, objectName: string) {
    const dbFile = await this.db.file.findFirst({
      where: { objectName, userId, isDeleted: true },
    });

    if (!dbFile) {
      throw new NotFoundException('File not found in trash');
    }

    await this.minio.removeFile('data', objectName);
    await this.db.file.delete({ where: { id: dbFile.id } });

    return { success: true };
  }

  async permanentlyDeleteAll(userId: string) {
    const dbFiles = await this.db.file.findMany({
      where: { userId, isDeleted: true },
    });

    if (dbFiles.length === 0) {
      return { success: true };
    }

    const objectNames = dbFiles.map((f) => f.objectName);

    await this.minio.removeFiles('data', objectNames);

    await this.db.file.deleteMany({
      where: { id: { in: dbFiles.map((f) => f.id) } },
    });

    return { success: true };
  }

  async getDownloadStream(userId: string, objectName: string) {
    const { file: dbFile } = await this.findAccessibleFile(
      userId,
      objectName,
    );

    const stream = await this.minio.downloadFile('data', objectName);

    return { stream, dbFile };
  }

  async renameFile(userId: string, objectName: string, newName: string) {
    const dbFile = await this.findUserFile(userId, objectName);

    await this.db.file.update({
      where: { id: dbFile.id },
      data: { displayName: newName },
    });

    return { success: true };
  }

  async toggleStar(userId: string, objectName: string) {
    const access = await this.findAccessibleFile(userId, objectName);

    if (access.isOwner) {
      await this.db.file.update({
        where: { id: access.file.id },
        data: { isStarred: !access.file.isStarred },
      });
    } else if (access.share) {
      await this.db.fileShare.update({
        where: { id: access.share.id },
        data: { isStarred: !access.share.isStarred },
      });
    }

    return { success: true };
  }

  async unToggleStar(userId: string, objectName: string) {
    const access = await this.findAccessibleFile(userId, objectName);

    if (access.isOwner) {
      await this.db.file.update({
        where: { id: access.file.id },
        data: { isStarred: false },
      });
    } else if (access.share) {
      await this.db.fileShare.update({
        where: { id: access.share.id },
        data: { isStarred: false },
      });
    }

    return { success: true };
  }

  private async findUserFile(userId: string, objectName: string) {
    const dbFile = await this.db.file.findFirst({
      where: { objectName, userId },
    });

    if (!dbFile) {
      throw new NotFoundException('File not found');
    }

    return dbFile;
  }

  async getSharedFiles(userId: string) {
    const shares = await this.db.fileShare.findMany({
      where: { sharedWithId: userId, revokedAt: null },
      include: {
        file: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    return shares.map((s: any) => ({
      ...toFileResponse(s.file),
      isStarred: s.isStarred ?? false,
      ownerName: s.file.user?.name || s.file.user?.email || 'Unknown',
    }));
  }

  private async findAccessibleFile(userId: string, objectName: string) {
    const dbFile = await this.db.file.findFirst({
      where: { objectName },
      include: {
        shares: {
          where: { sharedWithId: userId, revokedAt: null },
          take: 1,
        },
      },
    });

    if (!dbFile) {
      throw new NotFoundException('File not found');
    }

    if (dbFile.userId === userId) {
      return { file: dbFile, share: null, isOwner: true };
    }

    const share = dbFile.shares?.[0];
    if (!share) {
      throw new NotFoundException('File not found');
    }

    return { file: dbFile, share, isOwner: false };
  }

  async initiateUpload(
    userId: string,
    originalName: string,
    mimeType: string,
    parentPath?: string,
  ) {
    const normalizedPath = this.normalizePath(parentPath);
    const objectName = this.buildObjectName(userId, normalizedPath, randomUUID());
    const { uploadId } = await this.minio.initiateMultipartUpload(
      'data',
      originalName,
      mimeType,
      objectName,
    );
    return { uploadId, objectName };
  }

  async uploadPart(
    userId: string,
    objectName: string,
    uploadId: string,
    partNumber: number,
    buffer: Buffer,
  ) {
    return this.minio.uploadPart(
      'data',
      objectName,
      uploadId,
      partNumber,
      buffer,
    );
  }

  async completeUpload(
    userId: string,
    objectName: string,
    uploadId: string,
    parts: { etag: string; partNumber: number }[],
    originalName: string,
    mimeType: string,
    size: number,
    parentPath?: string,
  ) {
    await this.minio.completeMultipartUpload(
      'data',
      objectName,
      uploadId,
      parts,
    );

    const ext = path.extname(originalName).replace('.', '');
    const normalizedPath = this.normalizePath(parentPath);

    const dbFile = await this.db.file.create({
      data: {
        bucket: 'data',
        objectName,
        originalName,
        displayName: `${normalizedPath}${originalName}`,
        size,
        mimeType,
        extension: ext || null,
        userId,
      },
    });

    return toFileResponse(dbFile);
  }

  async createFolder(userId: string, name: string, parentPath?: string) {
    const folderName = this.normalizeFolderName(name);
    const normalizedPath = this.normalizePath(parentPath);
    const displayName = `${normalizedPath}${folderName}/`;
    const objectName = this.buildObjectName(userId, displayName, '');

    const existing = await this.db.file.findFirst({
      where: { userId, displayName, isDeleted: false },
    });
    if (existing) {
      throw new BadRequestException('Folder already exists');
    }

    await this.minio.createEmptyObject('data', objectName);

    const dbFile = await this.db.file.create({
      data: {
        bucket: 'data',
        objectName,
        originalName: folderName,
        displayName,
        size: 0,
        mimeType: 'application/x-directory',
        extension: null,
        userId,
      },
    });

    return toFileResponse(dbFile);
  }

  private normalizePath(pathValue?: string) {
    if (!pathValue) return '';
    const normalized = pathValue.replace(/\\/g, '/').trim();
    if (!normalized || normalized === '/') return '';
    const trimmed = normalized.replace(/^\/+/, '').replace(/\/+$/, '');
    return trimmed ? `${trimmed}/` : '';
  }

  private normalizeFolderName(name: string) {
    const trimmed = name?.trim();
    if (!trimmed) {
      throw new BadRequestException('Folder name is required');
    }
    if (trimmed.includes('/') || trimmed.includes('\\')) {
      throw new BadRequestException('Folder name cannot contain slashes');
    }
    return trimmed;
  }

  private buildObjectName(userId: string, pathValue: string, suffix: string) {
    const normalized = pathValue ? pathValue.replace(/^\/+/, '') : '';
    return `${userId}/${normalized}${suffix}`;
  }
}
