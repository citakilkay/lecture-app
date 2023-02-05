import { ApiProperty } from "@nestjs/swagger"
import { Role } from "src/shared/enum/role.enum"

export class FilterUserDto {
    @ApiProperty({ default: '', required: false })
    search: string
    @ApiProperty({ required: false })
    isActive?: boolean
    @ApiProperty({ required: false, default: 1 })
    page: number
    @ApiProperty({ required: false })
    pageSize?: number

    @ApiProperty({ required: false, default: [], isArray: true, enum: Role })
    roles?: Role[]
}