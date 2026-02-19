import { Module } from '@nestjs/common';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';
import { DatabaseModule } from '../database/database.module';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [DatabaseModule, MinioModule],
  controllers: [ShareController],
  providers: [ShareService],
})
export class ShareModule {}
