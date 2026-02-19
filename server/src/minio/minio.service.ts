import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import * as Minio from 'minio';
import { randomUUID } from 'crypto';

export class BufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

function decodeOriginalName(name: string) {
  if (!name) return name;
  if (!/[ÐÑ]/.test(name)) return name;
  return Buffer.from(name, 'latin1').toString('utf8');
}

function encodeMetaName(name: string) {
  return Buffer.from(name, 'utf8').toString('base64');
}

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;
  private readonly bucketName = 'data';

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT ?? 'localhost',
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY ?? '',
      secretKey: process.env.MINIO_SECRET_KEY ?? '',
    });
  }

  async onModuleInit() {
    await this.ensureBucket(this.bucketName);
  }

  private async ensureBucket(bucketName: string) {
    try {
      const exists = await this.minioClient.bucketExists(bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
      }
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Failed to initialize storage bucket: ${err.message}`,
      );
    }
  }

  async uploadFile(
    bucketName: string,
    file: BufferedFile,
    objectNameOverride?: string,
  ) {
    if (!file?.buffer) {
      throw new BadRequestException('File not received or buffer missing');
    }

    const safeName = decodeOriginalName(file.originalname);
    const objectName = objectNameOverride || randomUUID();

    try {
      await this.minioClient.putObject(
        bucketName,
        objectName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
          'original-name': encodeMetaName(safeName),
        },
      );
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Failed to upload file: ${err.message}`,
      );
    }

    return {
      objectName,
      originalName: safeName,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async createEmptyObject(
    bucketName: string,
    objectName: string,
    contentType = 'application/x-directory',
  ) {
    try {
      await this.minioClient.putObject(
        bucketName,
        objectName,
        Buffer.alloc(0),
        0,
        {
          'Content-Type': contentType,
        },
      );
      return { success: true };
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Failed to create object: ${err.message}`,
      );
    }
  }

  async removeFile(bucketName: string, objectName: string) {
    try {
      await this.minioClient.removeObject(bucketName, objectName);
      return { success: true };
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Failed to delete: ${err.message}`,
      );
    }
  }

  async removeFiles(bucketName: string, objectNames: string[]) {
    try {
      await this.minioClient.removeObjects(bucketName, objectNames);
      return { success: true };
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Failed to delete: ${err.message}`,
      );
    }
  }

  async downloadFile(bucketName: string, objectName: string) {
    try {
      return await this.minioClient.getObject(bucketName, objectName);
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Failed to download file: ${err.message}`,
      );
    }
  }

  async getPresignedUrl(
    bucketName: string,
    objectName: string,
    expirySeconds = 3600,
  ): Promise<string> {
    return this.minioClient.presignedGetObject(
      bucketName,
      objectName,
      expirySeconds,
    );
  }

  async initiateMultipartUpload(
    bucketName: string,
    originalName: string,
    mimeType: string,
    objectNameOverride?: string,
  ) {
    const objectName = objectNameOverride || randomUUID();
    const safeName = decodeOriginalName(originalName);

    try {
      const uploadId = await (
        this.minioClient as any
      ).initiateNewMultipartUpload(bucketName, objectName, {
        'Content-Type': mimeType,
        'original-name': encodeMetaName(safeName),
      });
      return { uploadId, objectName };
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Failed to init upload: ${err.message}`,
      );
    }
  }

  async uploadPart(
    bucketName: string,
    objectName: string,
    uploadId: string,
    partNumber: number,
    buffer: Buffer,
  ) {
    try {
      const res = await (this.minioClient as any).makeRequestAsync(
        {
          method: 'PUT',
          bucketName,
          objectName,
          query: `uploadId=${uploadId}&partNumber=${partNumber}`,
          headers: {},
        },
        buffer,
      );
      const etagHeader = res?.headers?.etag || res?.headers?.ETag;
      if (!etagHeader) {
        throw new Error('ETag not found in uploadPart response');
      }
      const etag = String(etagHeader).replace(/"/g, '');
      return { etag };
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Failed to upload part: ${err.message}`,
      );
    }
  }

  async completeMultipartUpload(
    bucketName: string,
    objectName: string,
    uploadId: string,
    parts: { etag: string; partNumber: number }[],
  ) {
    try {
      await (this.minioClient as any).completeMultipartUpload(
        bucketName,
        objectName,
        uploadId,
        parts.map((part) => ({ etag: part.etag, part: part.partNumber })),
      );
      return { success: true };
    } catch (err: any) {
      throw new InternalServerErrorException(
        `Failed to complete upload: ${err.message}`,
      );
    }
  }

  async abortMultipartUpload(
    bucketName: string,
    objectName: string,
    uploadId: string,
  ) {
    try {
      await (this.minioClient as any).abortMultipartUpload(
        bucketName,
        objectName,
        uploadId,
      );
    } catch (err) {}
  }
}
