import { ApiProperty } from "@nestjs/swagger"

export class FilterFranchiseeDto {
    @ApiProperty({ default: '', required: false })
    search: string = ''

    @ApiProperty({ required: false })
    isActive?: boolean

    @ApiProperty({ required: false, default: 1 })
    page: number = 1

    @ApiProperty({ required: false })
    pageSize?: number
}