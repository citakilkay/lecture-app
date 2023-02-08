import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "src/database/entities/user.entity";
import { Role } from "src/shared/enum/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }
    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass()
        ])
        console.log(requiredRoles, "req")
        if (!requiredRoles) {
            return true;
        }

        const { user }: { user: User } = context.switchToHttp().getRequest()
        if (!user) {
            throw new HttpException('User must be Login', HttpStatus.UNAUTHORIZED)
        }
        console.log(requiredRoles.some(role => user?.roles.includes(role)))
        return requiredRoles.some(role => user?.roles.includes(role))
    }
}