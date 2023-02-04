import { ApiProperty } from "@nestjs/swagger"
import { LectureStatus } from "src/shared/enum/lecture-status.enum"

export class FilterLectureDto {
    @ApiProperty({ default: '', required: false })
    search: string = ''

    @ApiProperty({ required: false })
    isActive?: boolean

    @ApiProperty({ required: false, default: 1 })
    page: number = 1

    @ApiProperty({ required: false })
    pageSize?: number

    @ApiProperty({ required: false })
    status?: LectureStatus
}