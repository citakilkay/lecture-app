import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Franchisee } from "src/database/entities/franchisee.entity";
import { Lecture } from "src/database/entities/lecture.entity";
import { User } from "src/database/entities/user.entity";
import { Like, Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUserDto";
import { FilterUserDto } from "./dto/filterUserDto";
import { UpdateUserDto } from "./dto/updateUserDto";

@Injectable({})
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Franchisee)
        private franchiseeRepository: Repository<Franchisee>
        @InjectRepository(Lecture)
        private lectureRepository: Repository<Lecture>
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
        const { username, isActive, emailAddress, password, roles, lecturerFranchiseeId, studentFranchiseeId } = updateUserDto;
        const userWillbeUpdated = await this.userRepository.findOne({ where: { id: updateUserDto.id } });
        userWillbeUpdated.username = username;
        userWillbeUpdated.password = password;
        userWillbeUpdated.emailAddress = emailAddress;
        userWillbeUpdated.isActive = isActive;
        userWillbeUpdated.roles = roles;
        const lecturerFranchisee = this.franchiseeRepository.findOne({ where: { id: lecturerFranchiseeId } });
        const studentFranchisee = this.franchiseeRepository.findOne({ where: { id: studentFranchiseeId } });
        const lecturesForTeach = this.lectureRepository.find({});

        userWillbeUpdated.lecturerFranchisee
        userWillbeUpdated.studentFranchisee
        userWillbeUpdated.lecturesForStudy
        userWillbeUpdated.lecturesForTeach
        userWillbeUpdated.
            return;
    }
}