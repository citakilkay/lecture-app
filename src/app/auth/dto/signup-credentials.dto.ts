import { IsEmail, IsOptional, Matches, MinLength } from "class-validator";
import { Role } from "src/shared/enum/role.enum";

export class SignupCredentials {
    @MinLength(6, { message: 'Username is too short' })
    username: string;

    role: RoleForSignup;

    franchiseeId: string; // A superadmin cannot sign up. It must be create by another superadmin. So franchiseeId must have a value

    @IsOptional()
    @IsEmail({ message: 'Email address is not valid' })
    emailAddress?: string;

    @MinLength(6, { message: 'Password must have at least 6 character' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,}$/, { message: 'Password must have at least one letter and one number' })
    password: string;
}

export enum RoleForSignup { // Superadmin and admin cannot signup. It must be create or update by another user.
    Student = Role.Student,
    Lecturer = Role.Lecturer
}