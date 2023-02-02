import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Franchisee } from "src/database/entities/franchisee.entity";
import { Lecture } from "src/database/entities/lecture.entity";
import { User } from "src/database/entities/user.entity";
import { Repository } from "typeorm";
import { FilterLectureDto } from "./dto/filterLectureDto";

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

    async getAll(filterDto: FilterLectureDto): Promise<Lecture> {
        return;
    }

    async get(id: string): Promise<Lecture> {
        const lecture = await this.lectureRepository.findOne({ where: { id } })
        if (lecture) {
            return lecture;
        }
        throw new NotFoundException(`Lecture with ID ${id} is not found`);
    }

    async create(createLectureDto): Promise<Lecture> {
        return
    }

    async update(): Promise<Lecture> {
        return;
    }

    async delete(id: string): Promise<Lecture> {
        const deleteToLecture = await this.lectureRepository.findOne({ where: { id } })
        if (!deleteToLecture) {
            throw new NotFoundException(`Lecture with id ${id} not found`);
        }
        return await this.lectureRepository.softRemove(deleteToLecture)
    }
}