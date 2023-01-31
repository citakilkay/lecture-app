import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/database/entities/user.entity";
import { Like, Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUserDto";
import { FilterUserDto } from "./dto/filterUserDto";

@Injectable({})
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }
    async getAll(filterDto: FilterUserDto): Promise<[User[], number]> {
        const { isActive, search, page, pageSize } = filterDto
        const skip = (page - 1) * pageSize;
        const users = await this.userRepository.find({
            where: [
                isActive !== undefined ? { isActive: isActive } : {},
                {
                    username: search !== '' ? Like(`%${search}%`) : undefined,
                    emailAddress: search !== '' ? Like(`%${search}%`) : undefined, // typecheck required because (null == false) returns true
                }],
            take: pageSize, skip
        })
        const total = users.length
        return [users, total];
    }

    async get(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } })
        if (user) {
            return user;
        }
        throw new NotFoundException(`User with ID ${id} is not found`);
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { } = createUserDto;
        return this.userRepository.create()
        return;
    }
}