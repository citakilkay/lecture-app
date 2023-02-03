import { Controller, Get, Param, Query } from "@nestjs/common";
import { Body, Post, Put } from "@nestjs/common/decorators";
import { Franchisee } from "src/database/entities/franchisee.entity";
import { CreateFranchiseeDto } from "./dto/create-franchisee.dto";
import { FilterFranchiseeDto } from "./dto/filter-franchisee.dto";
import { UpdateFranchiseeDto } from "./dto/update-franchisee.dto";
import { FranchiseeService } from "./franchisee.service";

@Controller('franchisee')
export class FranchiseeController {
    constructor(private franchiseeService: FranchiseeService) { }

    @Get()
    async getAll(
        @Query() filterFranchiseeDto: FilterFranchiseeDto
    ): Promise<[Franchisee[], number]> {
        return await this.franchiseeService.getAll(filterFranchiseeDto)
    }
    @Get('/:id')
    get(@Param('id') id: string): Promise<Franchisee> {
        return this.franchiseeService.get(id);
    }
    @Post()
    create(@Body() createFranchiseeDto: CreateFranchiseeDto): Promise<Franchisee> {
        return this.franchiseeService.create(createFranchiseeDto);
    }
    @Put()
    update(@Body() updateFranchiseeDto: UpdateFranchiseeDto): Promise<Franchisee> {
        return this.franchiseeService.update(updateFranchiseeDto)
    }
}