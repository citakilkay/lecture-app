import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { BadRequestException, HttpException } from "@nestjs/common/exceptions";
import { InjectRepository } from "@nestjs/typeorm";
import { stat } from "fs";
import { Franchisee } from "src/database/entities/franchisee.entity";
import { Lecture } from "src/database/entities/lecture.entity";
import { User } from "src/database/entities/user.entity";
import { LectureStatus } from "src/shared/enum/lecture-status.enum";
import { Role } from "src/shared/enum/role.enum";
import { FindOptionsWhere, In, Like, Repository } from "typeorm";
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

    async getAll(filterDto: FilterLectureDto, user: User): Promise<[Lecture[], number]> {
        const { search = '', page = 1, pageSize, status } = filterDto
        const skip = (page - 1) * pageSize;

        const customWhereOptions: FindOptionsWhere<Lecture>[] = []
        if (search) {
            customWhereOptions.push({ name: Like(`%${search}%`) })
        }
        if (status) {
            customWhereOptions.push({ status })
        }
        switch (true) {
            case user.roles.includes(Role.SuperAdmin):
                break;
            case user.roles.includes(Role.Admin):
                customWhereOptions.push({ franchisee: { id: user.adminFranchisee.id } })
                break;
            case user.roles.includes(Role.Student):
                customWhereOptions.push({ franchisee: { id: user.studentFranchisee.id } })
                break;
            default:
                break;
        }
        const lectures = await this.lectureRepository.find({
            where: customWhereOptions ? customWhereOptions : {},
            take: pageSize,
            skip: skip ? skip : undefined
        })

        const total = lectures.length;
        return [lectures, total];
    }

    async get(id: string): Promise<Lecture> {
        const lecture = await this.lectureRepository.findOne({ where: { id } })
        if (lecture) {
            return lecture;
        }
        throw new HttpException(`Lecture with ID ${id} is not found`, HttpStatus.NOT_FOUND);
    }

    async create(createLectureDto: CreateLectureDto, user: User): Promise<Lecture> {
        const { name, eventDate, lecturerId } = createLectureDto;
        const newLecture = new Lecture();
        newLecture.name = name
        newLecture.eventDate = eventDate

        if (!user.adminFranchisee) {
            throw new HttpException("User must be an Admin", HttpStatus.UNAUTHORIZED);
        }
        const lecturer = await this.userRepository.findOne({ where: { id: lecturerId } })
        newLecture.franchisee = user.adminFranchisee
        newLecture.lecturer = lecturer
        return await this.lectureRepository.save(newLecture)
    }

    async update(updateLectureDto: UpdateLectureDto, user: User): Promise<Lecture> {
        const { id, name, eventDate, status, lecturerId, studentIds } = updateLectureDto;
        const updateToLecture = await this.lectureRepository.findOne({ where: { id } })
        if (updateToLecture) {
            throw new HttpException(`Lecture with id ${id} not found`, HttpStatus.NOT_FOUND)
        }
        if (updateToLecture.status != LectureStatus.OPEN) {
            throw new HttpException("Lecture has passed the update time", HttpStatus.UNPROCESSABLE_ENTITY)
        }
        if (!user.adminFranchisee) {
            throw new HttpException("User must be an Admin", HttpStatus.UNAUTHORIZED);
        }

        const lecturer = await this.userRepository.findOne({ where: { id: lecturerId } })
        const students = await this.userRepository.find({ where: { id: In(studentIds) } })
        updateToLecture.name = name
        updateToLecture.eventDate = eventDate
        updateToLecture.status = status
        updateToLecture.franchisee = user.adminFranchisee
        updateToLecture.lecturer = lecturer
        updateToLecture.students = students
        await this.lectureRepository.save(updateToLecture)
        return updateToLecture;
    }

    async cancel(id: string): Promise<Lecture> {
        const cancelToLecture = await this.lectureRepository.findOne({ where: { id } })
        if (!cancelToLecture) {
            throw new HttpException(`Lecture with ID ${id} is not found`, HttpStatus.NOT_FOUND);
        }
        cancelToLecture.status = LectureStatus.CANCELLED
        return await this.lectureRepository.save(cancelToLecture)
    }

    async attend(id: string, user: User): Promise<void> {
        const lecture = await this.lectureRepository.findOne({ where: { id } })
        if (user.isActive && user.studentFranchisee?.isActive) {
            lecture.students.push(user)
            await this.lectureRepository.save(lecture)
            return;
        }
        throw new HttpException('User and Franchisee must must be active', HttpStatus.FORBIDDEN);
    }

    async abandon(id: string, user: User): Promise<void> {
        const lecture = await this.lectureRepository.findOne({ where: { id } })
        lecture.students.push(user)
        await await this.lectureRepository.save(lecture)
        return
    }

    async delete(id: string): Promise<Lecture> {
        const deleteToLecture = await this.lectureRepository.findOne({ where: { id } })
        if (!deleteToLecture) {
            throw new HttpException(`Lecture with id ${id} not found`, HttpStatus.NOT_FOUND);
        }
        return await this.lectureRepository.softRemove(deleteToLecture)
    }
}