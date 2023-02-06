import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/shared/enum/role.enum";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import * as bcrypt from 'bcrypt';

const superadmin = new User()
superadmin.username = 'superadmin'
superadmin.emailAddress = 'superadmin@gmail.com'
superadmin.isActive = true
superadmin.roles = [Role.SuperAdmin]

const users: User[] = [superadmin]

@Injectable()
export class SeederService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async seed() {
        for (const user of users) {
            const existUser = await this.userRepository.findOne({ where: { username: superadmin.username } })
            if (!existUser) {
                const password = '123qwe'
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(password, salt);
                user.password = hashedPassword
                await this.userRepository.save(user)
            }
        }
    }
} 