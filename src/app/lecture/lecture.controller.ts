import { Controller, Get, Param, Query } from "@nestjs/common";
import { Body, Delete, Patch, Post, Put } from "@nestjs/common/decorators";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Lecture } from "src/database/entities/lecture.entity";
import { User } from "src/database/entities/user.entity";
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
    @ApiResponse({ status: 200, type: Promise<[Lecture[], number]> })
    async getAll(
        @Query() filterLectureDto: FilterLectureDto
    ): Promise<[Lecture[], number]> {
        return await this.lectureService.getAll(filterLectureDto)
    }
    @Get('/:id')
    @ApiOperation({ summary: 'Get Lecture' })
    @ApiResponse({ status: 200, type: Promise<Lecture> })
    get(@Param('id') id: string): Promise<Lecture> {
        return this.lectureService.get(id);
    }
    @Post()
    @ApiOperation({ summary: 'Create Lecture' })
    @ApiResponse({ status: 200, type: Promise<Lecture> })
    create(@Body() createLectureDto: CreateLectureDto): Promise<Lecture> {
        return this.lectureService.create(createLectureDto);
    }

    @Put()
    @ApiOperation({ summary: 'Update Lecture' })
    @ApiResponse({ status: 200, type: Lecture })
    update(@Body() updateLectureDto: UpdateLectureDto): Promise<Lecture> {
        return this.lectureService.update(updateLectureDto)
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'Cancel Lecture' })
    @ApiResponse({ status: 200, type: Lecture })
    cancel(@Param('id') id: string): Promise<Lecture> {
        return this.lectureService.cancel(id);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete Lecture' })
    @ApiResponse({ status: 200, type: Lecture })
    async delete(@Param('id') id: string): Promise<Lecture> {
        return await this.lectureService.delete(id)
    }
}