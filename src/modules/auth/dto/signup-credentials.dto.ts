import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from "class-validator";
import { UserRole } from "../../../shared/utils/enum";

export class SignUpCredentialsDto {
    @IsEmail()
    email: string

    @IsString()
    @MinLength(3)
    @MaxLength(10)
    password: string

    @IsOptional()
    role?: UserRole
}