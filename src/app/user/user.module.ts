import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Franchisee } from 'src/database/entities/franchisee.entity';
import { Lecture } from 'src/database/entities/lecture.entity';
import { User } from 'src/database/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
    imports: [TypeOrmModule.forFeature([User, Franchisee, Lecture])],
})
export class UserModule {
}
