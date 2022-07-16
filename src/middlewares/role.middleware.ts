import { Request, Response, NextFunction } from "express";
import { User } from "../modules/user/entity/user.entity";

export const RoleMiddleware = (roleType: any, skipMissingProperties = false) => {
    return (req: Request & { user: User }, res: Response, next: NextFunction) => {
        if (req.hasOwnProperty('user')) {
            if (req.user.role !== roleType) {
                return res.status(403).json({
                    statusCode: 403,
                    success: false,
                    message: 'Permission Denied',
                    error: null
                })
            }
        }
        next();
    }
}