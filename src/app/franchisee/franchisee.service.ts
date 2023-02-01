import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Franchisee } from "src/database/entities/franchisee.entity";
import { Like, Repository } from "typeorm";
import { CreateFranchiseeDto } from "./dto/createFranchiseeDto";
import { FilterFranchiseeDto } from "./dto/filterFranchiseeDto";

@Injectable({})
export class FranchiseeService {
    constructor(
        @InjectRepository(Franchisee)
        private franchiseeRepository: Repository<Franchisee>,
    ) { }
    async getAll(filterDto: FilterFranchiseeDto): Promise<[Franchisee[], number]> {
        const { isActive, search, page, pageSize } = filterDto
        const skip = (page - 1) * pageSize;
        const franchisees = await this.franchiseeRepository.find({
            where: [
                isActive !== undefined ? { isActive: isActive } : {},
                {
                    name: search !== '' ? Like(`%${search}%`) : undefined
                }],
            take: pageSize, skip
        })
        const total = franchisees.length
        return [franchisees, total];
    }

    async get(id: string): Promise<Franchisee> {
        const franchisee = await this.franchiseeRepository.findOne({ where: { id } })
        if (franchisee) {
            return franchisee;
        }
        throw new NotFoundException(`Franchisee with ID ${id} is not found`);
    }

    async create(createFranchiseeDto: CreateFranchiseeDto): Promise<Franchisee> {
        const { } = createFranchiseeDto;
        return this.franchiseeRepository.create()
        return;
    }
}