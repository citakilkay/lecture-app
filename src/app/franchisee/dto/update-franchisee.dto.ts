import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID, ValidateNested } from "class-validator";

export class UpdateFranchiseeDto {
    @IsUUID()
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