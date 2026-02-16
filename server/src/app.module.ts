import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioModule } from './minio/minio.module';
import { LoginModule } from './login/login.module';




@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MinioModule, LoginModule],
  controllers: [],
  providers: [],
})
export class AppModule {}