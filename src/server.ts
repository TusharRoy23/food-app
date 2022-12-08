import express, { Request, Response, NextFunction } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';

import container from './core/container.core';
import { HttpStatusCode } from './shared/utils/enum';
import {
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
    UnauthorizedException,
    ConflictException,
    ForbiddenException,
    MethodNotAllowedException,
    RequestTimeoutException
} from './shared/errors/all.exception';
import apolloServer from './apollo.server';


let router = express.Router({
    caseSensitive: true,
    mergeParams: false,
    strict: false
});

export const server = new InversifyExpressServer(container, router);
server.setConfig(async app => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });
});

const errorResponse = (req: Request, res: Response, message: string, statusCode: any, error?: any) => {
    return res.status(statusCode).json({
        statusCode: statusCode,
        success: false,
        message: message,
        error: error || []
    });
}

server.setErrorConfig(app => {
    app.use((error: any, req: Request, res: Response, next: NextFunction) => {
        if (error instanceof NotFoundException) {
            return errorResponse(
                req,
                res,
                error.message,
                HttpStatusCode.NOT_FOUND,
            );
        }
        else if (error instanceof BadRequestException) {
            return errorResponse(
                req,
                res,
                error.message,
                HttpStatusCode.BAD_REQUEST,
                error.validationErrors,
            );
        }
        else if (error instanceof InternalServerErrorException) {
            return errorResponse(
                req,
                res,
                error.message,
                HttpStatusCode.INTERNAL_SERVER,
            );
        }
        else if (error instanceof UnauthorizedException) {
            return errorResponse(
                req,
                res,
                error.message,
                HttpStatusCode.UNAUTHORIZED,
            );
        }
        else if (error instanceof ConflictException) {
            return errorResponse(
                req,
                res,
                error.message,
                HttpStatusCode.CONFLICT,
            );
        }
        else if (error instanceof ForbiddenException) {
            return errorResponse(
                req,
                res,
                error.message,
                HttpStatusCode.FORBIDDEN,
            );
        }
        else if (error instanceof MethodNotAllowedException) {
            return errorResponse(
                req,
                res,
                error.message,
                HttpStatusCode.METHOD_NOT_ALLOWED,
            );
        }
        else if (error instanceof RequestTimeoutException) {
            return errorResponse(
                req,
                res,
                error.message,
                HttpStatusCode.REQUEST_TIMEOUT,
            );
        }
        next(error);
    });
})