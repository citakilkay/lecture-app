import { Controller, Get, Param, Query } from "@nestjs/common";
import { Body, Delete, Post, Put, UseGuards } from "@nestjs/common/decorators";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Franchisee } from "src/database/entities/franchisee.entity";
import { CreateFranchiseeDto } from "./dto/create-franchisee.dto";
import { FilterFranchiseeDto } from "./dto/filter-franchisee.dto";
import { UpdateFranchiseeDto } from "./dto/update-franchisee.dto";
import { FranchiseeService } from "./franchisee.service";

@ApiTags('franchisee')
@Controller('franchisee')
@UseGuards(AuthGuard('jwt'))
export class FranchiseeController {
    constructor(private franchiseeService: FranchiseeService) { }

    @Get()
    @ApiOperation({ summary: 'GetAll Franchisee' })
    @ApiResponse({ status: 200 })
    async getAll(
        @Query() filterFranchiseeDto: FilterFranchiseeDto
    ): Promise<[Franchisee[], number]> {
        return await this.franchiseeService.getAll(filterFranchiseeDto)
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get Franchisee' })
    @ApiResponse({ status: 200 })
    get(@Param('id') id: string): Promise<Franchisee> {
        return this.franchiseeService.get(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create Franchisee' })
    @ApiResponse({ status: 200 })
    create(@Body() createFranchiseeDto: CreateFranchiseeDto): Promise<Franchisee> {
        return this.franchiseeService.create(createFranchiseeDto);
    }

    @Put()
    @ApiOperation({ summary: 'Update Franchisee' })
    @ApiResponse({ status: 200 })
    update(@Body() updateFranchiseeDto: UpdateFranchiseeDto): Promise<Franchisee> {
        return this.franchiseeService.update(updateFranchiseeDto)
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete Franchisee' })
    @ApiResponse({ status: 200 })
    async delete(@Param('id') id: string): Promise<Franchisee> {
        return await this.franchiseeService.delete(id)
    }
}