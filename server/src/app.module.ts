import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './files/files.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { StorageModule } from './storage/storage.module';
import { ShareModule } from './share/share.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    FilesModule,
    AuthModule,
    StorageModule,
    ShareModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
