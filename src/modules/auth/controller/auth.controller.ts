import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost, requestBody } from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { IAuthService } from '../interfaces/IAuth.service';
import { DtoValidationMiddleware } from '../../../middlewares/dto-validation.middleware';
import { SignInCredentialsDto, SignUpCredentialsDto } from '../dto/index.dto';


@controller('/auth')
export class AuthController {
    constructor(
        @inject(TYPES.IAuthService) private readonly authService: IAuthService,
    ) {}

    @httpPost('/signup', DtoValidationMiddleware(SignUpCredentialsDto))
    public async create(
        @requestBody() body: SignUpCredentialsDto, req: Request, res: Response
    ) {
        const msg = await this.authService.createUser(body);
        return res.status(201).json({
            'message': msg
        });
    }

    @httpPost('/signin', DtoValidationMiddleware(SignInCredentialsDto))
    public async signIn(
        @requestBody() body: SignInCredentialsDto, req: Request, res: Response
    ) {
        const user = await this.authService.signIn(body);
        return res.status(200).json({
            results: user
        });
    }
}