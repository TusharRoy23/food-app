import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from "class-validator";

export class RatingDto {
    @IsNotEmpty()
    @IsUUID()
    restaurent_uuid: string;

    @Min(1)
    @Max(5)
    @IsNumber()
    star: number;
}