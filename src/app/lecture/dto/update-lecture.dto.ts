import { ApiProperty } from "@nestjs/swagger";
import { LectureStatus } from "src/shared/enum/lecture-status.enum";

export class UpdateLectureDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    eventDate: Date;

    @ApiProperty({ enum: LectureStatus })
    status: LectureStatus;

    @ApiProperty()
    lecturerId: string;

    @ApiProperty({ isArray: true, default: [] })
    studentIds: string[] = [];
}