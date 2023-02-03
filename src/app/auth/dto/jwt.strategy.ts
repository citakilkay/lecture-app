import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/database/entities/user.entity";
import { Repository } from "typeorm";
import { JwtPayload } from "../jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        super({
            secretOrKey: 'testSecret12',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { usernameorEmailAddress } = payload;
        const user: User = await this.userRepository.findOne({ where: [{ username: usernameorEmailAddress }, { emailAddress: usernameorEmailAddress }] })
        if (!user) {
            throw new UnauthorizedException('Please Login');
        }
        return user

    }
}