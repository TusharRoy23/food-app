import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { User } from "../modules/user/entity/user.entity";
import { TYPES } from "../core/type.core";
import { IJsonWebTokenService } from "../shared/interfaces/IJsonWebToken.service";

@injectable()
export class AuthenticationMiddleware extends BaseMiddleware {
    constructor(
        @inject(TYPES.IJsonWebTokenService) private readonly jsonWebTokenService: IJsonWebTokenService
    ) {
        super();
    }
    async handler(req: Request & { user: User }, res: Response, next: NextFunction) {
        const token = req.headers?.authorization?.replace('Bearer ', '');
        if (token === undefined) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'Unauthorized',
                error: null
            });
        }
        
        try {
            if (!req.body?.token) {
                const decode = await this.jsonWebTokenService.decode(token as string, true);
                req.user = decode as unknown as User;
            }
            next();
        } catch (error) {
            return res.status(403).json({
                statusCode: 403,
                success: false,
                message: 'Token Expired',
                error: null
            });
        }
        
    }
    
}