import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ShareService } from './share.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Sharing')
@Controller()
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @UseGuards(AuthGuard)
  @Post('files/:id/share-link')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a public share link for a file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 201, description: 'Share link URL returned' })
  @ApiResponse({ status: 404, description: 'File not found' })
  createShareLink(@Param('id') fileId: string, @Req() req) {
    return this.shareService.createShareLink(req.user.sub, fileId);
  }

  @UseGuards(AuthGuard)
  @Post('files/:id/revoke-link')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Revoke all active share links for a file' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'Links revoked' })
  @ApiResponse({ status: 404, description: 'File not found' })
  revokeShareLink(@Param('id') fileId: string, @Req() req) {
    return this.shareService.revokeShareLink(req.user.sub, fileId);
  }

  @UseGuards(AuthGuard)
  @Post('files/:id/share-user')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Share a file with another user' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File shared successfully' })
  @ApiResponse({ status: 404, description: 'File or user not found' })
  shareWithUser(
    @Param('id') fileId: string,
    @Body() body: { emailOrName: string; role: 'VIEWER' | 'EDITOR' },
    @Req() req,
  ) {
    return this.shareService.shareWithUser(
      req.user.sub,
      fileId,
      body.emailOrName,
      body.role,
    );
  }

  @UseGuards(AuthGuard)
  @Post('files/:id/revoke-user')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Revoke a user's access to a file" })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'Access revoked' })
  @ApiResponse({ status: 404, description: 'File not found' })
  revokeUserAccess(
    @Param('id') fileId: string,
    @Body() body: { userId: string },
    @Req() req,
  ) {
    return this.shareService.revokeUserAccess(
      req.user.sub,
      fileId,
      body.userId,
    );
  }

  @UseGuards(AuthGuard)
  @Get('files/:id/shares')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List all users a file is shared with' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'List of shares' })
  @ApiResponse({ status: 404, description: 'File not found' })
  getFileShares(@Param('id') fileId: string, @Req() req) {
    return this.shareService.getFileShares(req.user.sub, fileId);
  }

  @UseGuards(AuthGuard)
  @Get('users/search')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Search users by email or name' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Matching users (max 10)' })
  searchUsers(@Query('q') query: string, @Req() req) {
    return this.shareService.searchUsers(query || '', req.user.sub);
  }

  @Get('s/:token')
  @ApiOperation({ summary: 'Access a shared file by token (public)' })
  @ApiParam({ name: 'token', description: 'Share link token' })
  @ApiResponse({ status: 200, description: 'File metadata with presigned URL' })
  @ApiResponse({ status: 404, description: 'Link not found or deactivated' })
  getSharedFile(@Param('token') token: string) {
    return this.shareService.getFileByToken(token);
  }
}
