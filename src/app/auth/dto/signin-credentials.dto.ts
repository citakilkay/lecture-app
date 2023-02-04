import { ApiProperty } from "@nestjs/swagger";

export class SigninCredentials {
    @ApiProperty()
    usernameorEmailAddress: string;
    @ApiProperty()
    password: string;
    @ApiProperty({ required: false })
    franchiseeId?: string;
}