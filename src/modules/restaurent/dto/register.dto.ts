import { IsEmail, IsString, MaxLength, MinLength, } from "class-validator";
import { isTime } from "../../../shared/dto/custom.validator";

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(3)
    @MaxLength(10)
    password: string;

    @IsString()
    @MinLength(3)
    @MaxLength(15)
    name: string;

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    address: string;

    @IsString()
    @isTime('opening_time', { message: 'time must be valid' })
    opening_time: string;

    @IsString()
    @isTime('closing_time', { message: 'time must be valid' })
    closing_time: string;
}