import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Franchisee } from "src/database/entities/franchisee.entity";
import { Lecture } from "src/database/entities/lecture.entity";
import { User } from "src/database/entities/user.entity";
import { Role } from "src/shared/enum/role.enum";
import { FindOptionsWhere, In, Like, Repository } from "typeorm";
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
    async getAll(filterDto: FilterUserDto, user: User): Promise<[User[], number]> {
        const { isActive, search = '', page = 1, pageSize, roles = [] } = filterDto
        const skip = (page - 1) * pageSize;
        const customWhereOptions: FindOptionsWhere<User>[] = []
        if (search) {
            customWhereOptions.push({ username: Like(`%${search}%`) })
            customWhereOptions.push({ emailAddress: Like(`%${search}%`) })
        }
        if (roles.length) {
            customWhereOptions.push({ roles: In(roles) })
        }
        if (isActive !== undefined) {
            customWhereOptions.push({ isActive: isActive })
        }

        switch (true) {
            case user.roles.includes(Role.SuperAdmin):
                break;
            case user.roles.includes(Role.Admin):
                customWhereOptions.push({ adminFranchisee: { id: user.adminFranchisee.id } }, { adminFranchisee: { id: user.lecturerFranchisee.id } }, { adminFranchisee: { id: user.studentFranchisee.id } })
                break;
            default:
                break;
        }

        const users = await this.userRepository.find({
            where: customWhereOptions.length ? customWhereOptions : {},
            take: pageSize,
            skip: skip ? skip : undefined
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
        const { username, isActive, emailAddress, password, roles, lecturerFranchiseeId, studentFranchiseeId, adminFranchiseeId } = createUserDto;
        const newUser = new User();
        newUser.username = username;
        newUser.isActive = isActive;
        newUser.emailAddress = emailAddress;
        newUser.password = password;
        if (lecturerFranchiseeId) {
            const lecturerFranchisee = await this.franchiseeRepository.findOne({ where: { id: lecturerFranchiseeId } })
            newUser.lecturerFranchisee = lecturerFranchisee;
        }
        if (studentFranchiseeId) {
            const studentFranchisee = await this.franchiseeRepository.findOne({ where: { id: studentFranchiseeId } })
            newUser.studentFranchisee = studentFranchisee;
        }
        if (adminFranchiseeId) {
            const adminFranchisee = await this.franchiseeRepository.findOne({ where: { id: studentFranchiseeId } });
            newUser.adminFranchisee = adminFranchisee;
        }
        newUser.roles = roles;

        return await this.userRepository.save(newUser);
    }

    async update(updateUserDto: UpdateUserDto): Promise<User> {
        const { id, username, isActive, emailAddress, password, roles, lecturerFranchiseeId, studentFranchiseeId, lecturesForTeachIds, lecturesForStudyIds, adminFranchiseeId } = updateUserDto;
        const userToUpdate = await this.userRepository.findOne({ where: { id } });

        if (!userToUpdate) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        if (lecturerFranchiseeId) {
            const lecturerFranchisee = await this.franchiseeRepository.findOne({ where: { id: lecturerFranchiseeId } });
            userToUpdate.lecturerFranchisee = lecturerFranchisee;
        }
        if (studentFranchiseeId) {
            const studentFranchisee = await this.franchiseeRepository.findOne({ where: { id: studentFranchiseeId } });
            userToUpdate.studentFranchisee = studentFranchisee;
        }

        if (adminFranchiseeId) {
            const adminFranchisee = await this.franchiseeRepository.findOne({ where: { id: adminFranchiseeId } })
            userToUpdate.adminFranchisee = adminFranchisee
        }
        const lecturesForTeach = await this.lectureRepository.find({ where: { id: In(lecturesForTeachIds) } });
        userToUpdate.lecturesForTeach = lecturesForTeach

        const lecturesForStudy = await this.lectureRepository.find({ where: { id: In(lecturesForStudyIds) } });
        userToUpdate.lecturesForStudy = lecturesForStudy

        userToUpdate.username = username;
        userToUpdate.password = password;
        userToUpdate.emailAddress = emailAddress;
        userToUpdate.isActive = isActive;
        userToUpdate.roles = roles;

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