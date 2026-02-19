import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { MinioModule } from '../minio/minio.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, MinioModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
