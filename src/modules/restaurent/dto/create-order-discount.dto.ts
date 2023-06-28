import { isValidDate, isValidDateRange, isValidNumber, isValidNumberRange } from "../../../shared/dto/custom.validator";

export class CreateOrderDiscountDto {
    @isValidNumber('max_amount')
    max_amount: number;

    @isValidNumber('min_amount')
    @isValidNumberRange('max_amount')
    min_amount: number;

    @isValidNumber('discount_rate')
    discount_rate: number;

    @isValidDate('start_date')
    start_date: string;

    @isValidDate('end_date')
    @isValidDateRange('start_date')
    end_date: string;
}