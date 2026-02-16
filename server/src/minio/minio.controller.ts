import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  Res,
  Query,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MinioService, BufferedFile } from './minio.service';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Get('all-files')
  async allFiles() {
    return this.minioService.allFiles('data');
  }

  @Get('more-files')
  async moreFiles(
    @Query('limit') limit?: number,
    @Query('startAfter') startAfter?: string,
  ) {
    return this.minioService.allFiles('data');
  }

  @Get('storage')
  async getStorage() {
    const ONE_GB = 1024 * 1024 * 1024;

    return this.minioService.getStorageUsage('data', ONE_GB);
  }

  @Post('upload-file')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadFile(@UploadedFile() file: BufferedFile) {
    return this.minioService.uploadFile('data', file);
  }

  @Post('remove-file')
  async removeFile(@Body() body: { file: string }) {
    return this.minioService.removeFile('data', body.file);
  }

  @Post('download-file')
  async downloadFile(@Body() body: { file: string }, @Res() res: Response) {
    const fileStream = await this.minioService.downloadFile('data', body.file);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${body.file}"`);

    fileStream.pipe(res);
  }
  @Post('rename-file')
  async renameFile(@Body() body: { oldName: string; newName: string }) {
    return this.minioService.renameFile('data', body.oldName, body.newName);
  }
}
