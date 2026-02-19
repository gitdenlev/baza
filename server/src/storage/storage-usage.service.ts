import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { StorageUsageDto } from './dto/storage-usage.dto';

@Injectable()
export class StorageUsageService {
  constructor(private readonly db: DatabaseService) {}

  async getUsage(userId: string): Promise<StorageUsageDto> {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: { quotaBytes: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const quotaBytes = user.quotaBytes;

    const usedAgg = await this.db.file.aggregate({
      where: {
        userId,
      },
      _sum: {
        size: true,
      },
    });

    const trashAgg = await this.db.file.aggregate({
      where: {
        userId,
        NOT: { deletedAt: null },
      },
      _sum: {
        size: true,
      },
    });

    const usedBytes = BigInt(usedAgg._sum.size ?? 0);
    const trashBytes = BigInt(trashAgg._sum.size ?? 0);

    const freeBytes = quotaBytes > usedBytes ? quotaBytes - usedBytes : 0n;

    const percentUsed =
      quotaBytes > 0n ? Number((usedBytes * 10000n) / quotaBytes) / 100 : 0;

    return {
      usedBytes,
      trashBytes,
      quotaBytes,
      freeBytes,
      percentUsed,
    };
  }
}