import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AccessTokenDto } from "./dto/access-token.dto";
import { SigninCredentials } from "./dto/signin-credentials.dto";
import { SignupCredentials } from "./dto/signup-credentials.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    signup(@Body() signupCredentials: SignupCredentials): Promise<void> {
        return this.authService.signup(signupCredentials)
    }

    @Post('/signin')
    signin(@Body() signincredentials: SigninCredentials): Promise<{ accessToken: string }> {
        return this.authService.signin(signincredentials)
    }
}