import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { stat } from "fs";
import { Franchisee } from "src/database/entities/franchisee.entity";
import { Lecture } from "src/database/entities/lecture.entity";
import { User } from "src/database/entities/user.entity";
import { LectureStatus } from "src/shared/enum/lecture-status.enum";
import { In, Like, Repository } from "typeorm";
import { CreateLectureDto } from "./dto/create-lecture.dto";
import { FilterLectureDto } from "./dto/filter-lecture.dto";
import { UpdateLectureDto } from "./dto/update-lecture.dto";

@Injectable({})
export class LectureService {
    constructor(
        @InjectRepository(Lecture)
        private lectureRepository: Repository<Lecture>,
        @InjectRepository(Franchisee)
        private franchiseeRepository: Repository<Franchisee>,
        @InjectRepository(Lecture)
        private userRepository: Repository<User>
    ) { }

    async getAll(filterDto: FilterLectureDto): Promise<[Lecture[], number]> {
        const { isActive, search, page, pageSize, status } = filterDto
        const skip = (page - 1) * pageSize;
        const lectures = await this.lectureRepository.find({
            where: [
                status ? { status } : {},
                search != '' ? { name: Like(`%${search}%`) } : {},
            ],
            take: pageSize, skip
        })

        const total = lectures.length;
        return [lectures, total];
    }

    async get(id: string): Promise<Lecture> {
        const lecture = await this.lectureRepository.findOne({ where: { id } })
        if (lecture) {
            return lecture;
        }
        throw new NotFoundException(`Lecture with ID ${id} is not found`);
    }

    async create(createLectureDto: CreateLectureDto): Promise<Lecture> {
        const { name, eventDate, franchiseeId, lecturerId } = createLectureDto;
        const newLecture = new Lecture();
        newLecture.name = name
        newLecture.eventDate = eventDate

        const franchisee = await this.franchiseeRepository.findOne({ where: { id: franchiseeId } })
        const lecturer = await this.userRepository.findOne({ where: { id: lecturerId } })
        newLecture.franchisee = franchisee
        newLecture.lecturer = lecturer
        return await this.lectureRepository.save(newLecture)
    }

    async update(updateLectureDto: UpdateLectureDto): Promise<Lecture> {
        const { id, name, eventDate, status, franchiseeId, lecturerId, studentIds } = updateLectureDto;
        const updateToLecture = await this.lectureRepository.findOne({ where: { id } })
        if (updateToLecture) {
            throw new NotFoundException(`Lecture with id ${id} not found`)
        }
        if (updateToLecture.status != LectureStatus.OPEN) {
            throw new ForbiddenException("Lecture has passed the update time")
        }

        const franchisee = await this.franchiseeRepository.findOne({ where: { id: franchiseeId } })
        const lecturer = await this.userRepository.findOne({ where: { id: lecturerId } })
        const students = await this.userRepository.find({ where: { id: In(studentIds) } })
        updateToLecture.name = name
        updateToLecture.eventDate = eventDate
        updateToLecture.status = status
        updateToLecture.franchisee = franchisee
        updateToLecture.lecturer = lecturer
        updateToLecture.students = students
        await this.lectureRepository.save(updateToLecture)
        return updateToLecture;
    }

    async cancel(id: string): Promise<Lecture> {
        const cancelToLecture = await this.lectureRepository.findOne({ where: { id } })
        if (!cancelToLecture) {
            throw new NotFoundException(`Lecture with id ${id} not found`);
        }
        cancelToLecture.status = LectureStatus.CANCELLED
        return await this.lectureRepository.save(cancelToLecture)
    }

    async delete(id: string): Promise<Lecture> {
        const deleteToLecture = await this.lectureRepository.findOne({ where: { id } })
        if (!deleteToLecture) {
            throw new NotFoundException(`Lecture with id ${id} not found`);
        }
        return await this.lectureRepository.softRemove(deleteToLecture)
    }
}