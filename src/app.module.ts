import { Module } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './app/auth/auth.module';
import { FranchiseeModule } from './app/franchisee/franchisee.module';
import { LectureModule } from './app/lecture/lecture.module';
import { UserModule } from './app/user/user.module';

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
    })]
})
export class AppModule { }
