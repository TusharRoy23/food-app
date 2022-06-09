import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, requestParam } from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { IUserService } from '../interfaces/IUser.service';

@controller('/users')
export class UserController {
    constructor(
        @inject(TYPES.IUserService) private readonly userService: IUserService
    ) {}

    @httpGet('/:userId')
    public async getUser(
        @requestParam('userId') userId: number, req: Request, res: Response
    ) {
        const results = await this.userService.getUser(userId);
        return res.status(200).json({
            'results': results
        });
    }
}