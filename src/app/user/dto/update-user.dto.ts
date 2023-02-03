import { IsEmail, IsOptional, Matches, MinLength } from "class-validator";
import { Role } from "src/shared/enum/role.enum";

export class UpdateUserDto {
    id: string;

    @MinLength(6, { message: 'Username is too short' })
    username: string;

    @IsOptional()
    @IsEmail({ message: 'Email address is not valid' })
    emailAddress: string;

    isActive: boolean;

    @MinLength(6, { message: 'Password must have at least 6 character' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,}$/, { message: 'Password must have at least one letter and one number' })
    password: string;

    roles: Role[] = [];

    lecturerFranchiseeId?: string;

    studentFranchiseeId?: string;

    lecturesForTeachIds: string[] = [];

    lecturesForStudyIds: string[] = [];


}