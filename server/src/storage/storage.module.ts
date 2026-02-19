import { Module } from '@nestjs/common';
import { StorageUsageService } from './storage-usage.service';
import { StorageController } from './storage.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [StorageController],
  providers: [StorageUsageService],
  exports: [StorageUsageService],
})
export class StorageModule {}
