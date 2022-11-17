import { IsOptional } from "class-validator";
import { isValidDate, isValidDateRange, isValidNumber, isValidNumberRange } from "../../../shared/dto/custom.validator";

export class UpdateOrderDiscountDto {
    @IsOptional()
    @isValidNumber('max_amount')
    max_amount: number;

    @IsOptional()
    @isValidNumber('max_amount')
    @isValidNumberRange('min_amount')
    min_amount: number;

    @IsOptional()
    @isValidNumber('discount_rate')
    discount_rate: number;

    @IsOptional()
    @isValidDate('start_date')
    start_date: string;

    @IsOptional()
    @isValidDate('start_date')
    @isValidDateRange('end_date')
    end_date: string;
}