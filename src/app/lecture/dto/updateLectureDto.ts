import { LectureStatus } from "src/shared/enum/lecture-status.enum";

export class UpdateLectureDto {
    id: string;
    name: string;
    eventDate: Date;
    status: LectureStatus;
    franchiseeId: string;
    lecturerId: string;
    studentsId: string[];
}