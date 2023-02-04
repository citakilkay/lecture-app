import { ApiProperty } from "@nestjs/swagger";

export class CreateFranchiseeDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    credit: number;

    @ApiProperty()
    isActive: boolean;
}