import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "src/app/user/user.service";
import { Franchisee } from "src/database/entities/franchisee.entity";
import { User } from "src/database/entities/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./dto/jwt.strategy";
import 'dotenv/config.js';
import { RolesGuard } from "./guards/roles.guard";

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({ secret: process.env.JWT_SECRET }),
        TypeOrmModule.forFeature([User, Franchisee]),
    ],
    providers: [AuthService, JwtStrategy, RolesGuard],
    controllers: [AuthController],
    exports: [JwtStrategy, PassportModule],
})
export class AuthModule { }