import { LectureStatus } from "src/shared/enum/lecture-status.enum"

export class FilterLectureDto {
    search: string = ''
    isActive?: boolean
    page: number = 1
    pageSize?: number
    status?: LectureStatus
}