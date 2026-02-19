import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MinioService } from '../minio/minio.service';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class ShareService {
  constructor(
    private readonly db: DatabaseService,
    private readonly minio: MinioService,
  ) {}

  async createShareLink(userId: string, fileId: string) {
    const file = await this.db.file.findFirst({
      where: { id: fileId, userId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const existing = await this.db.fileShareLink.findFirst({
      where: { fileId, isActive: true },
    });

    if (existing) {
    }

    const token = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(token).digest('hex');

    await this.db.fileShareLink.create({
      data: {
        fileId,
        tokenHash,
        role: 'VIEWER',
      },
    });

    const appDomain = process.env.APP_DOMAIN || 'http://localhost:3000';

    return { url: `${appDomain}/s/${token}` };
  }

  async getFileByToken(token: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const shareLink = await this.db.fileShareLink.findFirst({
      where: { tokenHash, isActive: true },
      include: {
        file: true,
      },
    });

    if (!shareLink) {
      throw new NotFoundException('Link not found or deactivated');
    }

    const file = shareLink.file;

    const presignedUrl = await this.minio.getPresignedUrl(
      file.bucket,
      file.objectName,
      3600,
    );

    return {
      name: file.displayName,
      originalName: file.originalName,
      size: file.size,
      mimeType: file.mimeType,
      presignedUrl,
    };
  }

  async revokeShareLink(userId: string, fileId: string) {
    const file = await this.db.file.findFirst({
      where: { id: fileId, userId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.db.fileShareLink.updateMany({
      where: { fileId, isActive: true },
      data: { isActive: false },
    });

    return { success: true };
  }

  async shareWithUser(
    ownerId: string,
    fileId: string,
    emailOrName: string,
    role: 'VIEWER' | 'EDITOR',
  ) {
    const file = await this.db.file.findFirst({
      where: { id: fileId, userId: ownerId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const targetUser = await this.db.user.findFirst({
      where: {
        OR: [
          { email: { equals: emailOrName, mode: 'insensitive' } },
          { name: { equals: emailOrName, mode: 'insensitive' } },
        ],
      },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    if (targetUser.id === ownerId) {
      throw new ForbiddenException('Cannot share file with yourself');
    }

    await this.db.fileShare.upsert({
      where: {
        fileId_sharedWithId: {
          fileId,
          sharedWithId: targetUser.id,
        },
      },
      update: {
        permission: role,
        revokedAt: null,
      },
      create: {
        fileId,
        ownerId,
        sharedWithId: targetUser.id,
        permission: role,
      },
    });

    return { success: true, sharedWith: targetUser.name || targetUser.email };
  }

  async revokeUserAccess(ownerId: string, fileId: string, userId: string) {
    const file = await this.db.file.findFirst({
      where: { id: fileId, userId: ownerId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.db.fileShare.updateMany({
      where: { fileId, sharedWithId: userId },
      data: { revokedAt: new Date() },
    });

    return { success: true };
  }

  async getFileShares(ownerId: string, fileId: string) {
    const file = await this.db.file.findFirst({
      where: { id: fileId, userId: ownerId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const shares = await this.db.fileShare.findMany({
      where: { fileId, revokedAt: null },
      include: {
        sharedWith: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    return shares.map((s) => ({
      id: s.id,
      user: s.sharedWith,
      permission: s.permission,
      createdAt: s.createdAt,
    }));
  }

  async searchUsers(query: string, currentUserId: string) {
    const users = await this.db.user.findMany({
      where: {
        id: { not: currentUserId },
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, email: true, name: true },
      take: 10,
    });

    return users;
  }
}
