import { Module } from "@nestjs/common";
import { UserService } from "src/app/user/user.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {

}