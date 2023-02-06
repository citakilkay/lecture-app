import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Franchisee } from 'src/database/entities/franchisee.entity';
import { Lecture } from 'src/database/entities/lecture.entity';
import { User } from 'src/database/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';

@Module({
    controllers: [LectureController],
    providers: [LectureService],
    imports: [TypeOrmModule.forFeature([Franchisee, Lecture, User]), AuthModule],
})
export class LectureModule {
}