import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Lecture } from "src/database/entities/lecture.entity";
import { Franchisee } from "src/database/entities/franchisee.entity";
import { User } from "src/database/entities/user.entity";
import { Repository } from "typeorm";
import { FilterFranchiseeDto } from "./dto/filterFranchiseeDto";

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

    async getAll(filterDto: FilterFranchiseeDto): Promise<Franchisee> {
        return;
    }

    async get(id: string): Promise<Franchisee> {
        const franchisee = await this.franchiseeRepository.findOne({ where: { id } })
        if (franchisee) {
            return franchisee;
        }
        throw new NotFoundException(`Franchisee with ID ${id} is not found`);
    }

    async create(createFranchiseeDto): Promise<Franchisee> {
        return
    }

    async update(): Promise<Franchisee> {
        return;
    }

    async delete(id: string): Promise<Franchisee> {
        const deleteToFranchisee = await this.franchiseeRepository.findOne({ where: { id } })
        if (!deleteToFranchisee) {
            throw new NotFoundException(`Franchisee with id ${id} not found`);
        }
        return await this.franchiseeRepository.softRemove(deleteToFranchisee)
    }
}