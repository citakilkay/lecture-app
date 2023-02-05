import { Controller, Get, Param, Query } from "@nestjs/common";
import { Body, Delete, Patch, Post, Put } from "@nestjs/common/decorators";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Lecture } from "src/database/entities/lecture.entity";
import { User } from "src/database/entities/user.entity";
import { GetUser } from "src/shared/decorators/get-user.decorator";
import { CreateLectureDto } from "./dto/create-lecture.dto";
import { FilterLectureDto } from "./dto/filter-lecture.dto";
import { UpdateLectureDto } from "./dto/update-lecture.dto";
import { LectureService } from "./lecture.service";

@ApiTags('lecture')
@Controller('lecture')
export class LectureController {
    constructor(private lectureService: LectureService) { }

    @Get()
    @ApiOperation({ summary: 'Get All Lecture' })
    @ApiResponse({ status: 200 })
    async getAll(
        @Query() filterLectureDto: FilterLectureDto, @GetUser() user: User
    ): Promise<[Lecture[], number]> {
        return await this.lectureService.getAll(filterLectureDto, user)
    }
    @Get('/:id')
    @ApiOperation({ summary: 'Get Lecture' })
    @ApiResponse({ status: 200 })
    async get(@Param('id') id: string, @GetUser() user: User): Promise<Lecture> {
        return await this.lectureService.get(id);
    }
    @Post()
    @ApiOperation({ summary: 'Create Lecture' })
    @ApiResponse({ status: 200 })
    async create(@Body() createLectureDto: CreateLectureDto, @GetUser() user: User): Promise<Lecture> {
        return await this.lectureService.create(createLectureDto, user);
    }

    @Put()
    @ApiOperation({ summary: 'Update Lecture' })
    @ApiResponse({ status: 200 })
    async update(@Body() updateLectureDto: UpdateLectureDto, @GetUser() user: User): Promise<Lecture> {
        return await this.lectureService.update(updateLectureDto, user)
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'Cancel Lecture' })
    @ApiResponse({ status: 200 })
    async cancel(@Param('id') id: string, @GetUser() user: User): Promise<Lecture> {
        return await this.lectureService.cancel(id);
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'Attend Lecture as a student' })
    @ApiResponse({ status: 200 })
    async attend(@Param('id') id: string, @GetUser() user: User): Promise<void> {
        return await this.lectureService.attend(id, user);
    }

    @Patch(':/id')
    @ApiOperation({ summary: 'Abandon Lecture' })
    @ApiResponse({ status: 200 })
    async abandon(@Param('id') id: string, @GetUser() user: User): Promise<void> {
        return await this.lectureService.abandon(id, user)
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete Lecture' })
    @ApiResponse({ status: 200 })
    async delete(@Param('id') id: string): Promise<Lecture> {
        return await this.lectureService.delete(id)
    }
}