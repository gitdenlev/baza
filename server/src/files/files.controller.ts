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
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { BufferedFile } from '../minio/minio.service';
import { FilesService } from './files.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Files')
@ApiBearerAuth('access-token')
@Controller('files')
@UseGuards(AuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all active files for the current user' })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['name', 'date', 'size'],
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @ApiResponse({ status: 200, description: 'List of files' })
  allFiles(
    @Query('sortBy') sortBy: 'name' | 'date' | 'size' = 'date',
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Req() req,
  ) {
    return this.filesService.getAllFiles(req.user.sub, sortBy, order);
  }

  @Get('deleted')
  @ApiOperation({ summary: 'Get all trashed files' })
  @ApiResponse({ status: 200, description: 'List of trashed files' })
  deletedFiles(@Req() req) {
    return this.filesService.getDeletedFiles(req.user.sub);
  }

  @Get('starred')
  @ApiOperation({ summary: 'Get all starred files' })
  @ApiResponse({ status: 200, description: 'List of starred files' })
  starredFiles(@Req() req) {
    return this.filesService.getStarredFiles(req.user.sub);
  }

  @Get('shared')
  @ApiOperation({ summary: 'Get files shared with the current user' })
  @ApiResponse({ status: 200, description: 'List of shared files' })
  sharedFiles(@Req() req) {
    return this.filesService.getSharedFiles(req.user.sub);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search files by name' })
  @ApiQuery({ name: 'query', required: false, description: 'Search term' })
  @ApiResponse({ status: 200, description: 'Matching files' })
  searchFile(@Query('query') query: string, @Req() req) {
    if (!query || !query.trim()) {
      return this.filesService.getAllFiles(req.user.sub);
    }
    return this.filesService.searchFiles(req.user.sub, query);
  }

  @Post('upload')
  @HttpCode(201)
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  uploadFile(
    @UploadedFile() file: BufferedFile,
    @Body('parentPath') parentPath: string,
    @Req() req,
  ) {
    return this.filesService.uploadFile(req.user.sub, file, parentPath);
  }

  @Post('upload/init')
  @ApiOperation({ summary: 'Initiate multipart upload' })
  @ApiResponse({ status: 201, description: 'Upload initiated' })
  initUpload(
    @Body()
    body: { filename: string; mimeType: string; parentPath?: string },
    @Req() req,
  ) {
    return this.filesService.initiateUpload(
      req.user.sub,
      body.filename,
      body.mimeType,
      body.parentPath,
    );
  }

  @Post('upload/chunk')
  @ApiOperation({ summary: 'Upload a part of the file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadChunk(
    @UploadedFile() file: BufferedFile,
    @Body() body: { uploadId: string; partNumber: string; objectName: string },
    @Req() req,
  ) {
    return this.filesService.uploadPart(
      req.user.sub,
      body.objectName,
      body.uploadId,
      parseInt(body.partNumber, 10),
      file.buffer,
    );
  }

  @Post('upload/complete')
  @ApiOperation({ summary: 'Complete multipart upload' })
  @ApiResponse({ status: 201, description: 'Upload completed' })
  completeUpload(
    @Body()
    body: {
      uploadId: string;
      objectName: string;
      parts: { etag: string; partNumber: number }[];
      filename: string;
      mimeType: string;
      size: number;
      parentPath?: string;
    },
    @Req() req,
  ) {
    return this.filesService.completeUpload(
      req.user.sub,
      body.objectName,
      body.uploadId,
      body.parts,
      body.filename,
      body.mimeType,
      body.size,
      body.parentPath,
    );
  }

  @Post('folder')
  @ApiOperation({ summary: 'Create an empty folder placeholder' })
  @ApiResponse({ status: 201, description: 'Folder created' })
  @ApiResponse({ status: 400, description: 'Invalid folder name' })
  createFolder(
    @Body() body: { name: string; parentPath?: string },
    @Req() req,
  ) {
    return this.filesService.createFolder(
      req.user.sub,
      body.name,
      body.parentPath,
    );
  }

  @Post('remove')
  @ApiOperation({ summary: 'Move file to trash (soft delete)' })
  @ApiResponse({ status: 200, description: 'File moved to trash' })
  @ApiResponse({ status: 404, description: 'File not found' })
  removeFile(@Body() body: { file: string }, @Req() req) {
    return this.filesService.softDeleteFile(req.user.sub, body.file);
  }

  @Post('restore')
  @ApiOperation({ summary: 'Restore file from trash' })
  @ApiResponse({ status: 200, description: 'File restored' })
  @ApiResponse({ status: 404, description: 'File not found in trash' })
  restoreFile(@Body() body: { file: string }, @Req() req) {
    return this.filesService.restoreFile(req.user.sub, body.file);
  }

  @Post('permanently-delete')
  @ApiOperation({ summary: 'Permanently delete a file from trash' })
  @ApiResponse({ status: 200, description: 'File permanently deleted' })
  @ApiResponse({ status: 404, description: 'File not found in trash' })
  permanentlyDeleteFile(@Body() body: { file: string }, @Req() req) {
    return this.filesService.permanentlyDeleteFile(req.user.sub, body.file);
  }

  @Post('delete-all')
  @ApiOperation({ summary: 'Permanently delete all trashed files' })
  @ApiResponse({ status: 200, description: 'All trashed files deleted' })
  deleteAllPermanently(@Req() req) {
    return this.filesService.permanentlyDeleteAll(req.user.sub);
  }

  @Post('download')
  @ApiOperation({ summary: 'Download a file as binary stream' })
  @ApiResponse({ status: 200, description: 'Binary file stream' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async downloadFile(
    @Body() body: { file: string },
    @Req() req,
    @Res() res: Response,
  ) {
    const { stream, dbFile } = await this.filesService.getDownloadStream(
      req.user.sub,
      body.file,
    );

    res.setHeader(
      'Content-Type',
      dbFile.mimeType || 'application/octet-stream',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(dbFile.displayName)}"`,
    );

    stream.pipe(res);
  }

  @Post('rename')
  @ApiOperation({ summary: 'Rename a file' })
  @ApiResponse({ status: 200, description: 'File renamed' })
  @ApiResponse({ status: 404, description: 'File not found' })
  renameFile(@Body() body: { oldName: string; newName: string }, @Req() req) {
    return this.filesService.renameFile(
      req.user.sub,
      body.oldName,
      body.newName,
    );
  }

  @Post('toggle-star')
  @ApiOperation({ summary: 'Toggle starred status for a file' })
  @ApiResponse({ status: 200, description: 'Star toggled' })
  @ApiResponse({ status: 404, description: 'File not found' })
  toggleStar(@Body() body: { file: string }, @Req() req) {
    return this.filesService.toggleStar(req.user.sub, body.file);
  }

  @Post('untoggle-star')
  @ApiOperation({ summary: 'Remove file from starred' })
  @ApiResponse({ status: 200, description: 'Star removed' })
  @ApiResponse({ status: 404, description: 'File not found' })
  unToggleStar(@Body() body: { file: string }, @Req() req) {
    return this.filesService.unToggleStar(req.user.sub, body.file);
  }
}
