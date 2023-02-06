import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsUUID, Matches, MinLength } from "class-validator";
import { Role } from "src/shared/enum/role.enum";

export class CreateUserDto {

    @ApiProperty()
    @MinLength(6, { message: 'Username is too short' })
    username: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    @IsOptional()
    @IsEmail({ message: 'Email address is not valid' })
    emailAddress: string;

    @ApiProperty()
    @MinLength(6, { message: 'Password must have at least 6 character' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,}$/, { message: 'Password must have at least one letter and one number' })
    password: string;

    @ApiProperty({ default: [], isArray: true, enum: Role })
    roles: Role[] = [];

    @IsUUID()
    @ApiProperty({ required: false })
    lecturerFranchiseeId?: string;

    @IsUUID()
    @ApiProperty({ required: false })
    studentFranchiseeId?: string;

    @IsUUID()
    @ApiProperty({ required: false })
    adminFranchiseeId?: string;
}