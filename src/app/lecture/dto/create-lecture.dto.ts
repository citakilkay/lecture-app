import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { LectureStatus } from "src/shared/enum/lecture-status.enum";

export class CreateLectureDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    eventDate: Date;

    

    @ApiProperty({ default: LectureStatus.OPEN })
    status: LectureStatus = LectureStatus.OPEN;

    @IsUUID()
    @ApiProperty()
    lecturerId: string;
}