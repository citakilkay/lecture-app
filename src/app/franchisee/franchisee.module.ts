import { Module } from '@nestjs/common';
import { FranchiseeController } from './franchisee.controller';
import { FranchiseeService } from './franchisee.service';

@Module({
    controllers: [FranchiseeController],
    providers: [FranchiseeService]
})
export class FranchiseeModule {
}