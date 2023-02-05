import { Controller, Get, Param, Query } from "@nestjs/common";
import { Body, Delete, Post, Put } from "@nestjs/common/decorators";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "src/database/entities/user.entity";
import { GetUser } from "src/shared/decorators/get-user.decorator";
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
    @ApiResponse({ status: 200 })
    async getAll(@Query() filterUserDto: FilterUserDto, @GetUser() user): Promise<[User[], number]> {
        return await this.userService.getAll(filterUserDto, user)
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get User' })
    @ApiResponse({ status: 200 })
    get(@Param('id') id: string): Promise<User> {
        return this.userService.get(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create User' })
    @ApiResponse({ status: 200 })
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Put()
    @ApiOperation({ summary: 'Update User' })
    @ApiResponse({ status: 200 })
    update(@Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.userService.update(updateUserDto)
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete User' })
    @ApiResponse({ status: 200 })
    async delete(@Param('id') id: string): Promise<User> {
        return await this.userService.delete(id)
    }
}