import { IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";
import { ItemType, MealFlavor, MealState, MealType, ItemStatus } from "../../../shared/utils/enum";
import { isValidDate, isValidDateRange, isValidEnum, isValidNumber } from "../../../shared/dto/custom.validator";

export class CreateItemDto {
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    name: string;

    @IsString()
    @IsOptional()
    icon?: string;

    @IsString()
    @IsOptional()
    image?: string;

    @isValidEnum('item_type', ItemType)
    item_type: string;

    @isValidEnum('meal_type', MealType)
    meal_type: string;

    @isValidEnum('meal_state', MealState)
    meal_state: string;

    @isValidEnum('meal_flavor', MealFlavor)
    meal_flavor: string;

    @Min(0)
    @IsNotEmpty()
    @isValidNumber('price')
    price: number;

    @isValidEnum('item_status', ItemStatus)
    item_status: string;

    @Min(0)
    @IsNotEmpty()
    @isValidNumber('price')
    discount_rate?: number;

    @isValidDate('discount_start_date')
    discount_start_date?: string;

    @isValidDate('discount_end_date')
    @isValidDateRange('discount_start_date')
    discount_end_date?: string;
}