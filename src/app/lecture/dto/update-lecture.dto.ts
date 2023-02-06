import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { LectureStatus } from "src/shared/enum/lecture-status.enum";

export class UpdateLectureDto {
    @IsUUID()
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    eventDate: Date;

    @ApiProperty({ enum: LectureStatus })
    status: LectureStatus;

    @IsUUID()
    @ApiProperty()
    lecturerId: string;

    @ApiProperty({ isArray: true, default: [] })
    studentIds: string[] = [];
}