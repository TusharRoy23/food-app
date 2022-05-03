// import 'reflect-metadata';

import { Router } from 'express';
// import Container from 'typedi';
import AuthController from '../controller/auth.controller';

const authRouter = Router();
// const authController = Container.get(AuthController);
const authController = new AuthController();

authRouter.post('/register', authController.userRegistration);

export {
    authRouter
};