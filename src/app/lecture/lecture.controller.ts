import { Controller, Get, Param, Query } from "@nestjs/common";
import { Body, Patch, Post, Put } from "@nestjs/common/decorators";
import { Lecture } from "src/database/entities/lecture.entity";
import { CreateLectureDto } from "./dto/create-lecture.dto";
import { FilterLectureDto } from "./dto/filter-lecture.dto";
import { UpdateLectureDto } from "./dto/update-lecture.dto";
import { LectureService } from "./lecture.service";

@Controller('lecture')
export class LectureController {
    constructor(private lectureService: LectureService) { }
    @Get()
    async getAll(
        @Query() filterLectureDto: FilterLectureDto
    ): Promise<[Lecture[], number]> {
        return await this.lectureService.getAll(filterLectureDto)
    }
    @Get('/:id')
    get(@Param('id') id: string): Promise<Lecture> {
        return this.lectureService.get(id);
    }
    @Post()
    create(@Body() createLectureDto: CreateLectureDto): Promise<Lecture> {
        return this.lectureService.create(createLectureDto);
    }

    @Put()
    update(@Body() updateLectureDto: UpdateLectureDto): Promise<Lecture> {
        return this.lectureService.update(updateLectureDto)
    }

    @Patch('/:id')
    cancel(@Param('id') id: string): Promise<Lecture> {
        return this.lectureService.cancel(id);
    }
}