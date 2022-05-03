import { Router } from 'express';
import { authRouter } from '../modules/auth/routes/auth.router';

const api = Router();

api.use('/auth', authRouter);

export {
    api
};