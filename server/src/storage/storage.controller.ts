import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StorageUsageService } from './storage-usage.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Storage')
@ApiBearerAuth('access-token')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageUsageService: StorageUsageService) {}

  @UseGuards(AuthGuard)
  @Get('usage')
  @ApiOperation({ summary: 'Get storage usage for the current user' })
  @ApiResponse({ status: 200, description: 'Storage usage breakdown' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUsage(@Req() req) {
    const usage = await this.storageUsageService.getUsage(req.user.sub);

    return {
      usedBytes: Number(usage.usedBytes),
      trashBytes: Number(usage.trashBytes),
      quotaBytes: Number(usage.quotaBytes),
      freeBytes: Number(usage.freeBytes),
      percentUsed: usage.percentUsed,
    };
  }
}
