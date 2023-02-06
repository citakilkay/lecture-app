import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './app/auth/auth.module';
import { FranchiseeModule } from './app/franchisee/franchisee.module';
import { LectureModule } from './app/lecture/lecture.module';
import { UserModule } from './app/user/user.module';
import { CustomExceptionFilter } from './shared/filters/exception.filter';

@Module({
  imports: [AuthModule, UserModule, LectureModule, FranchiseeModule, SwaggerModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'indirim815',
      database: 'lecturesServer',
      autoLoadEntities: true,
      synchronize: true
    })],
  providers: [
    { provide: APP_FILTER, useClass: CustomExceptionFilter }
  ]
})
export class AppModule { }
