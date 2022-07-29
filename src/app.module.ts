import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AppDataSource,
  AppSeedDataSource,
} from './infrastructure/databases/config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forRoot(AppSeedDataSource.options),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
