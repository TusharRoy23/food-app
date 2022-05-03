import { Request, Response } from 'express';
import { injectable, autoInjectable } from 'tsyringe';
import AuthService from '../service/auth.service';

@autoInjectable()
export default class AuthController {
    constructor(
        private authService?: AuthService
    ) { 
    }

    async userRegistration (req: Request, res: Response) {
        console.log('req: ', req.body);
        try {
            const payload = req.body;
            const value = await this.authService.userRegistration(payload);

            return res.status(201).json({
                'result' : value
            });
        } catch (error) {
            console.log('error: ', error);
            return res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}