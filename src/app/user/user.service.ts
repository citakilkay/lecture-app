import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contains } from "class-validator";
import { Franchisee } from "src/database/entities/franchisee.entity";
import { Lecture } from "src/database/entities/lecture.entity";
import { User } from "src/database/entities/user.entity";
import { In, Like, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { FilterUserDto } from "./dto/filter-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable({})
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Franchisee)
        private franchiseeRepository: Repository<Franchisee>,
        @InjectRepository(Lecture)
        private lectureRepository: Repository<Lecture>
    ) { }
    async getAll(filterDto: FilterUserDto): Promise<[User[], number]> {
        const { isActive, search, page, pageSize, roles } = filterDto
        const skip = (page - 1) * pageSize;
        const users = await this.userRepository.find({
            where: [
                isActive !== undefined ? { isActive: isActive } : {},
                roles.length ? { roles: In(roles) } : {},
                search != '' ? { username: Like(`%${search}%`) } : {},
                search != '' ? { emailAddress: Like(`%${search}%`) } : {}],
            take: pageSize, skip
        })

        const total = users.length;
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
        const { username, isActive, emailAddress, password, roles, lecturerFranchiseeId, studentFranchiseeId } = createUserDto;
        const newUser = new User();
        newUser.username = username;
        newUser.isActive = isActive;
        newUser.emailAddress = emailAddress;
        newUser.password = password;
        const lecturerFranchisee = await this.franchiseeRepository.findOne({ where: { id: lecturerFranchiseeId } })
        const studentFranchisee = await this.franchiseeRepository.findOne({ where: { id: studentFranchiseeId } })
        newUser.lecturerFranchisee = lecturerFranchisee;
        newUser.studentFranchisee = studentFranchisee;
        newUser.roles = roles;

        return await this.userRepository.save(newUser);
    }

    async update(updateUserDto: UpdateUserDto): Promise<User> {
        const { id, username, isActive, emailAddress, password, roles, lecturerFranchiseeId, studentFranchiseeId, lecturesForTeachIds, lecturesForStudyIds } = updateUserDto;
        const userToUpdate = await this.userRepository.findOne({ where: { id } });

        if (!userToUpdate) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        const lecturerFranchisee = await this.franchiseeRepository.findOne({ where: { id: lecturerFranchiseeId } });
        const studentFranchisee = await this.franchiseeRepository.findOne({ where: { id: studentFranchiseeId } });
        const lecturesForTeach = await this.lectureRepository.find({ where: { id: In(lecturesForTeachIds) } });
        const lecturesForStudy = await this.lectureRepository.find({ where: { id: In(lecturesForStudyIds) } });

        userToUpdate.username = username;
        userToUpdate.password = password;
        userToUpdate.emailAddress = emailAddress;
        userToUpdate.isActive = isActive;
        userToUpdate.roles = roles;
        userToUpdate.lecturerFranchisee = lecturerFranchisee;
        userToUpdate.studentFranchisee = studentFranchisee;
        userToUpdate.lecturesForStudy = lecturesForStudy
        userToUpdate.lecturesForTeach = lecturesForTeach

        await this.userRepository.save(userToUpdate)
        return userToUpdate;
    }

    async delete(id: string): Promise<User> {

        const deleteToUser = await this.userRepository.findOne({ where: { id } })
        if (!deleteToUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return await this.userRepository.softRemove(deleteToUser)
    }
}