import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './app/auth/auth.module';
import { FranchiseeModule } from './app/franchisee/franchisee.module';
import { LectureModule } from './app/lecture/lecture.module';
import { UserModule } from './app/user/user.module';
import { CustomExceptionFilter } from './shared/filters/exception.filter';
import 'dotenv/config.js';
import { SeederService } from './database/seeds/seeder.service';
import { SeederModule } from './database/seeds/seeder.module';

@Module({
  imports: [UserModule, LectureModule, FranchiseeModule, SwaggerModule, SeederModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      host: process.env.DB_HOST,
      port: 5432, // port takes as a number but env file return a string
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    }), AuthModule],
  providers: [
    { provide: APP_FILTER, useClass: CustomExceptionFilter }
  ]
})
export class AppModule { }
