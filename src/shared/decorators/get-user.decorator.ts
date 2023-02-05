import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { User } from "src/database/entities/user.entity";

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext): User => {

    const req = ctx.switchToHttp().getRequest()
    if (req.user) {
        return req.user
    }
    throw new UnauthorizedException('Please Login')

})