import { LectureStatus } from "src/shared/enum/lecture-status.enum";

export class CreateLectureDto {
    name: string;
    eventDate: Date;
    status: LectureStatus;
    franchiseeId: string;
    lecturerId: string;
}