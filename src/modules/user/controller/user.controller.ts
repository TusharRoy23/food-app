import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, requestParam } from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { User } from '../entity/user.entity';
import { IUserService } from '../interfaces/IUser.service';

@controller('/users')
export class UserController {
    constructor(
        @inject(TYPES.IUserService) private readonly userService: IUserService
    ) {}

    @httpGet('/:uuid', TYPES.AuthenticationMiddleware)
    public async getUser(
        @requestParam('uuid') uuid: string, req: Request & { user: User }, res: Response
    ) {
        const results = await this.userService.getUser(uuid);
        return res.status(200).json({
            'results': results
        });
    }
}