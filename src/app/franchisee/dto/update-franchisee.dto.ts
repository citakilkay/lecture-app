import { ApiProperty } from "@nestjs/swagger";

export class UpdateFranchiseeDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    credit: number;

    @ApiProperty({ isArray: true, default: [] })
    studentIds: string[] = [];

    @ApiProperty({ default: [], isArray: true })
    lectureIds: string[] = [];

    @ApiProperty({ isArray: true, default: [] })
    lecturerIds: string[] = [];
}