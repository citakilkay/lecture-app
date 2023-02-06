import { SetMetadata } from "@nestjs/common/decorators/core/set-metadata.decorator";
import { Role } from "../enum/role.enum";

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles)