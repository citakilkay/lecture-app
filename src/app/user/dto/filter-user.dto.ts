import { Role } from "src/shared/enum/role.enum"

export class FilterUserDto {
    search: string = ''
    isActive?: boolean
    page: number = 1
    pageSize?: number
    roles: Role[] = []
}