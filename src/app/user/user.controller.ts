import { Controller, Get, Param, Query } from "@nestjs/common";
import { Body, Post, Put } from "@nestjs/common/decorators";
import { User } from "src/database/entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { FilterUserDto } from "./dto/filter-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    async getAll(
        @Query() filterUserDto: FilterUserDto
    ): Promise<[User[], number]> {
        return await this.userService.getAll(filterUserDto)
    }
    @Get('/:id')
    get(@Param('id') id: string): Promise<User> {
        return this.userService.get(id);
    }
    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }
    @Put()
    update(@Body() updateUserDto: UpdateUserDto): Promise<User> {
        return this.userService.update(updateUserDto)
    }
}