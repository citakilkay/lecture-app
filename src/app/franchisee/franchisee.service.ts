import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Lecture } from "src/database/entities/lecture.entity";
import { Franchisee } from "src/database/entities/franchisee.entity";
import { User } from "src/database/entities/user.entity";
import { FindOptionsWhere, In, Like, Repository } from "typeorm";
import { FilterFranchiseeDto } from "./dto/filter-franchisee.dto";
import { isNumber } from "class-validator";
import { UpdateFranchiseeDto } from "./dto/update-franchisee.dto";
import { CreateFranchiseeDto } from "./dto/create-franchisee.dto";
import { filter } from "rxjs";

@Injectable({})
export class FranchiseeService {
    constructor(
        @InjectRepository(Franchisee)
        private franchiseeRepository: Repository<Franchisee>,
        @InjectRepository(Lecture)
        private lectureRepository: Repository<Lecture>,
        @InjectRepository(Franchisee)
        private userRepository: Repository<User>
    ) { }

    async getAll(filterDto: FilterFranchiseeDto): Promise<[Franchisee[], number]> {
        const { isActive, search = '', page = 1, pageSize } = filterDto
        const skip = (page - 1) * pageSize;

        const customWhereOptions: FindOptionsWhere<Franchisee>[] = []
        if (search) {
            customWhereOptions.push({ name: Like(`%${search}%`) })
            if (isNumber(search)) {
                customWhereOptions.push({ credit: Like(parseInt(search)) })
            }
        }
        if (isActive !== undefined) {
            customWhereOptions.push({ isActive })
        }
        const franchisees = await this.franchiseeRepository.find({
            where: customWhereOptions.length ? customWhereOptions : {},
            take: pageSize,
            skip: skip ? skip : undefined
        })

        const total = franchisees.length;
        return [franchisees, total];
    }

    async get(id: string): Promise<Franchisee> {
        const franchisee = await this.franchiseeRepository.findOne({ where: { id }, relations: { students: true, lecturers: true, lectures: true } })
        if (franchisee) {
            return franchisee;
        }
        throw new HttpException(`Franchisee with ID ${id} is not found`, HttpStatus.NOT_FOUND);
    }

    async create(createFranchiseeDto: CreateFranchiseeDto): Promise<Franchisee> {
        const { name, isActive, credit } = createFranchiseeDto
        const newFranchisee = new Franchisee()
        newFranchisee.name = name
        newFranchisee.isActive = isActive
        newFranchisee.credit = credit
        return await this.franchiseeRepository.save(newFranchisee)
    }

    async update(updateFranchiseeDto: UpdateFranchiseeDto): Promise<Franchisee> {
        const { id, name, isActive, credit, studentIds, lectureIds, lecturerIds } = updateFranchiseeDto;
        const updateToFranchisee = await this.franchiseeRepository.findOne({ where: { id } })
        if (!updateToFranchisee) {
            throw new HttpException(`Franchisee with ID ${id} is not found`, HttpStatus.NOT_FOUND);
        }
        const lectures = await this.lectureRepository.find({ where: { id: In(lectureIds) } })
        const lecturers = await this.userRepository.find({ where: { id: In(lecturerIds) } })
        const students = await this.userRepository.find({ where: { id: In(studentIds) } })

        updateToFranchisee.name = name
        updateToFranchisee.isActive = isActive
        updateToFranchisee.students = students
        updateToFranchisee.lectures = lectures
        updateToFranchisee.credit = credit
        updateToFranchisee.lecturers = lecturers

        await this.franchiseeRepository.save(updateToFranchisee)
        return updateToFranchisee;
    }

    async delete(id: string): Promise<Franchisee> {
        const deleteToFranchisee = await this.franchiseeRepository.findOne({ where: { id } })
        if (!deleteToFranchisee) {
            throw new HttpException(`Franchisee with id ${id} not found`, HttpStatus.NOT_FOUND);
        }
        return await this.franchiseeRepository.softRemove(deleteToFranchisee)
    }
}