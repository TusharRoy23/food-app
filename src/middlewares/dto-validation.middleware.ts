import { Request, Response, NextFunction } from "express";
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from "class-validator";

export const DtoValidationMiddleware = (type: any, skipMissingProperties = false) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const dtoObj = plainToClass(type, req.body);
        validate(dtoObj, { skipMissingProperties }).then(
            (errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const errMsg: any = {};
                    errors.forEach(err => {
                        errMsg[err.property] = [...(Object as any).values(err.constraints)]
                    });
                    
                    res.status(400).json({
                        statusCode: 400,
                        success: false,
                        message: '',
                        error: errMsg
                    });
                } else {
                    req.body = dtoObj;
                    next();
                }
            }
        )
    }
}