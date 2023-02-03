import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "src/app/user/user.service";
import { User } from "src/database/entities/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./dto/jwt.strategy";

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
        secret: 'testSecret12',
        signOptions: {
            expiresIn: 86400
        }
    }),
    TypeOrmModule.forFeature([User])],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [PassportModule, JwtStrategy]
})
export class AuthModule {

}