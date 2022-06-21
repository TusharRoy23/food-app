import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { User } from "../modules/user/entity/user.entity";
import { TYPES } from "../core/type.core";
import { IDatabaseService } from "../core/interface/IDatabase.service";
import { IJsonWebTokenService } from "../shared/interfaces/IJsonWebToken.service";
import { Restaurent } from "../modules/restaurent/entity/restaurent.entity";

@injectable()
export class AuthenticationMiddleware extends BaseMiddleware {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
        @inject(TYPES.IJsonWebTokenService) private readonly jsonWebTokenService: IJsonWebTokenService
    ) {
        super();
    }
    async handler(req: Request & { user: User }, res: Response, next: NextFunction) {
        const token = req.headers?.authorization?.replace('Bearer ', '');
        if (token === undefined) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: 'Unauthorized',
                error: null
            });
        }

        try {
            if (!req.body?.token) {
                const decode = await this.jsonWebTokenService.decode(token as string, true);
                req.user = decode as unknown as User;
                if (decode.restaurent) {
                    const repo = await this.database.getRepository(Restaurent);
                    const info = await repo.findOne({ where: { uuid: decode.restaurent.uuid } }) as Restaurent;
                    req.user.restaurent = info;
                }
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