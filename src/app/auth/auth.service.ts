import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/database/entities/user.entity";
import { Repository } from "typeorm";
import { RoleForSignup, SignupCredentials } from "./dto/signup-credentials.dto";
import * as bcrypt from 'bcrypt';
import { Role } from "src/shared/enum/role.enum";
import { AccessTokenDto } from "./dto/access-token.dto";
import { SigninCredentials } from "./dto/signin-credentials.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { Franchisee } from "src/database/entities/franchisee.entity";
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Franchisee)
        private franchiseeRepository: Repository<Franchisee>,
        private jwtService: JwtService) {
    }
    async signup(signupCredentials: SignupCredentials): Promise<void> {
        const { username, password, emailAddress, role, franchiseeId } = signupCredentials
        const newUser = new User()
        newUser.username = username
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        newUser.password = hashedPassword
        newUser.emailAddress = emailAddress
        newUser.roles.push(Role[RoleForSignup[role]])
        const franchisee = await this.franchiseeRepository.findOne({ where: { id: franchiseeId } })
        switch (true) {
            case role == RoleForSignup.Student:
                newUser.studentFranchisee = franchisee
                break;
            case role == RoleForSignup.Lecturer:
                newUser.lecturerFranchisee = franchisee
                break;
            default:
                break;
        }
        try {
            await this.userRepository.save(newUser)
            return;
        } catch (err) {
            if (err.code === '23505') {
                // duplicate username or emailaddress
                throw new HttpException('Username or EmailAdress already exists', HttpStatus.CONFLICT);
            } else {
                throw new HttpException('Unknown Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async signin(signinCredentials: SigninCredentials): Promise<{ accessToken: string }> {
        const { usernameorEmailAddress, password } = signinCredentials
        const user = await this.userRepository.findOne({ where: [{ username: usernameorEmailAddress }, { emailAddress: usernameorEmailAddress }] })
        if (user && await bcrypt.compare(password, user.password)) {
            const payload: JwtPayload = { usernameorEmailAddress, id: user.id }
            const accessToken = this.jwtService.sign(payload)
            return { accessToken }
        }
        throw new HttpException('Please check your login credentials', HttpStatus.UNAUTHORIZED);
    }
}