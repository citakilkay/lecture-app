import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, Matches, MinLength } from "class-validator";
import { Role } from "src/shared/enum/role.enum";

export class UpdateUserDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    @MinLength(6, { message: 'Username is too short' })
    username: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail({ message: 'Email address is not valid' })
    emailAddress: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    @MinLength(6, { message: 'Password must have at least 6 character' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,}$/, { message: 'Password must have at least one letter and one number' })
    password: string;

    @ApiProperty({ enum: Role, isArray: true })
    roles: Role[] = [];

    @ApiProperty({ required: false })
    lecturerFranchiseeId?: string;

    @ApiProperty({ required: false })
    studentFranchiseeId?: string;

    @ApiProperty({ required: false })
    adminFranchiseeId?: string;

    lecturesForTeachIds: string[] = [];

    lecturesForStudyIds: string[] = [];
}