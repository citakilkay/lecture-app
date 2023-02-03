import { Controller, Get, Param, Query } from "@nestjs/common";
import { Body, Delete, Post, Put } from "@nestjs/common/decorators";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "src/database/entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { FilterUserDto } from "./dto/filter-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    @ApiOperation({ summary: 'Get All User' })
    @ApiResponse({ status: 200, type: User })
    async getAll(
        @Query() filterUserDto: FilterUserDto
    ): Promise<[User[], number]> {
        return await this.userService.getAll(filterUserDto)
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get User' })
    @ApiResponse({ status: 200, type: User })
    get(@Param('id') id: string): Promise<User> {
        return this.userService.get(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create User' })
    @ApiResponse({ status: 200, type: User })
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Put()
    @ApiOperation({ summary: 'Update User' })
    @ApiResponse({ status: 200, type: User })
    update(@Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.userService.update(updateUserDto)
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete User' })
    @ApiResponse({ status: 200, type: User })
    async delete(@Param('id') id: string): Promise<User> {
        return await this.userService.delete(id)
    }
}