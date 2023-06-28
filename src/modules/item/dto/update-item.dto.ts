import { IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { ItemType, MealFlavor, MealState, MealType, ItemStatus } from "../../../shared/utils/enum";
import { isValidDate, isValidDateRange, isValidEnum, isValidNumber } from "../../../shared/dto/custom.validator";

export class UpdateItemDto {
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
    @IsOptional()
    item_type?: string;

    @isValidEnum('meal_type', MealType)
    @IsOptional()
    meal_type?: string;

    @isValidEnum('meal_state', MealState)
    @IsOptional()
    meal_state?: string;

    @isValidEnum('meal_flavor', MealFlavor)
    @IsOptional()
    meal_flavor?: string;

    @Min(0)
    @IsNotEmpty()
    @isValidNumber('price')
    @IsOptional()
    price?: number;

    @isValidEnum('item_status', ItemStatus)
    @IsOptional()
    item_status?: string;

    @Min(0)
    @IsNotEmpty()
    @isValidNumber('price')
    @IsOptional()
    discount_rate?: number;

    @Max(100)
    @IsNumber()
    @IsOptional()
    max_order_qty?: number;

    @Min(1)
    @IsNumber()
    @IsOptional()
    min_order_qty?: number;
}