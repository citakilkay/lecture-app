import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/database/entities/user.entity";
import { Repository } from "typeorm";
import { RoleForSignup, SignupCredentials } from "./dto/signup-credentials.dto";
import * as bcrypt from 'bcrypt';
import { Role } from "src/shared/enum/role.enum";
import { AccessTokenDto } from "./dto/access-token.dto";
import { SigninCredentials } from "./dto/signin-credentials.dto";
import { JwtService } from "@nestjs/jwt/dist";
import { JwtPayload } from "./jwt-payload.interface";
@Injectable({})
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService) {
    }
    async signup(signupCredentials: SignupCredentials): Promise<void> {
        const { username, password, emailAddress, role } = signupCredentials
        const newUser = new User()
        newUser.username = username
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        newUser.password = hashedPassword
        newUser.emailAddress = emailAddress
        newUser.roles.push(Role[RoleForSignup[role]])

        try {
            await this.userRepository.save(newUser)
            return;
        } catch (err) {
            if (err.code === '23505') {
                // duplicate username or emailaddress
                throw new ConflictException('Username or EmailAdress already exists');
            } else {
                throw new InternalServerErrorException('Unknown Error');
            }
        }
    }
    async signin(signinCredentials: SigninCredentials): Promise<{ accessToken: string }> {

        const { usernameorEmailAddress, password, franchiseeId } = signinCredentials
        const user = await this.userRepository.findOne({ where: [{ username: usernameorEmailAddress }, { emailAddress: usernameorEmailAddress }] })
        if (!user || await bcrypt.compare(password, user.password)) {
            const payload: JwtPayload = { usernameorEmailAddress }
            const accessToken = await this.jwtService.signAsync(payload)
            return { accessToken }
        }
        throw new UnauthorizedException('Please check your login credentials');
    }
}