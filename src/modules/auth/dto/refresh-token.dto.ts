import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    token: string
}