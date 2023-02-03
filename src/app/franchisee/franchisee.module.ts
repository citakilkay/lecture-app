import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Franchisee } from 'src/database/entities/franchisee.entity';
import { FranchiseeController } from './franchisee.controller';
import { FranchiseeService } from './franchisee.service';

@Module({
    controllers: [FranchiseeController],
    providers: [FranchiseeService],
    imports: [TypeOrmModule.forFeature([Franchisee])],
})
export class FranchiseeModule {
}