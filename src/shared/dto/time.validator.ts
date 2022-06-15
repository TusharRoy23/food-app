import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import moment from "moment";

export const isTime = (property: string, validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'isTime',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    return typeof value === 'string' && moment(value, 'hh:mm:ss', true).isValid();
                }
            }
        })
    }
}