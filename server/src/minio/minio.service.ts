import { Injectable } from '@nestjs/common';
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

function decodeMetaName(b64?: string) {
  if (!b64) return undefined;
  try {
    return Buffer.from(b64, 'base64').toString('utf8');
  } catch {
    return undefined;
  }
}

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT ?? 'localhost',
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY ?? '',
      secretKey: process.env.MINIO_SECRET_KEY ?? '',
    });
  }

  async allFiles(bucketName: string) {
    const objects = await new Promise<any[]>((resolve, reject) => {
      const files: any[] = [];
      const stream = this.minioClient.listObjects(bucketName, '', true);

      stream.on('data', (obj) => files.push(obj));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(files));
    });

    const enriched = await Promise.all(
      objects.map(async (obj) => {
        try {
          const stat = await this.minioClient.statObject(bucketName, obj.name);
          const meta = stat.metaData || {};

          const originalNameB64 =
            meta['original-name'] || meta['x-amz-meta-original-name'];

          let originalName =
            decodeMetaName(originalNameB64) ??
            (typeof originalNameB64 === 'string'
              ? (() => {
                  try {
                    return decodeURIComponent(originalNameB64);
                  } catch {
                    return undefined;
                  }
                })()
              : undefined);

          return {
            objectName: obj.name,
            originalName: originalName ?? obj.name,
            size: obj.size,
            lastModified: obj.lastModified,
            etag: obj.etag,
          };
        } catch {
          return {
            objectName: obj.name,
            originalName: obj.name,
            size: obj.size,
            lastModified: obj.lastModified,
            etag: obj.etag,
          };
        }
      }),
    );

    return enriched;
  }

  async uploadFile(bucketName: string, file: BufferedFile) {
    if (!file?.buffer) {
      throw new Error('Файл не отримано або buffer відсутній');
    }

    const safeName = decodeOriginalName(file.originalname);
    const objectName = randomUUID();

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

    return {
      objectName,
      originalName: safeName,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async removeFile(bucketName: string, objectName: string) {
    try {
      await this.minioClient.removeObject(bucketName, objectName);
      return { success: true };
    } catch (err: any) {
      throw new Error(`Не вдалося видалити: ${err.message}`);
    }
  }

  async downloadFile(bucketName: string, objectName: string) {
    try {
      // objectName = UUID
      return await this.minioClient.getObject(bucketName, objectName);
    } catch (err: any) {
      throw new Error(`Не вдалося завантажити файл: ${err.message}`);
    }
  }

  async renameFile(bucketName: string, objectName: string, newName: string) {
    try {
      const stat = await this.minioClient.statObject(bucketName, objectName);

      const current = { ...(stat.metaData || {}) };

      delete (current as any)['x-amz-meta-original-name'];
      current['original-name'] = encodeMetaName(newName);

      await this.minioClient.copyObject(
        bucketName,
        objectName,
        `/${bucketName}/${objectName}`,
        {
          ...current,
          'Content-Type':
            stat.metaData?.['content-type'] ||
            stat.metaData?.['Content-Type'] ||
            undefined,
          'x-amz-metadata-directive': 'REPLACE',
        } as any,
      );

      return { success: true };
    } catch (err: any) {
      throw new Error(`Не вдалося перейменувати: ${err.message}`);
    }
  }

  async getStorageUsage(bucketName: string, limitInBytes: number) {
    return new Promise((resolve, reject) => {
      let totalSize = 0;
      const stream = this.minioClient.listObjects(bucketName, '', true);

      stream.on('data', (obj) => {
        totalSize += obj.size || 0;
      });

      stream.on('error', (err) => reject(err));

      stream.on('end', () => {
        const percentage = (totalSize / limitInBytes) * 100;

        resolve({
          used: totalSize,
          limit: limitInBytes,
          percentage: Number(percentage.toFixed(2)),
        });
      });
    });
  }
}
