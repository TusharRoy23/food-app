import 'reflect-metadata';
import { Request, Response, NextFunction } from "express";
import { User } from "../../modules/user/entity/user.entity";
import { IJsonWebTokenService } from "../../shared/interfaces/IJsonWebToken.service";
import { AuthenticationMiddleware } from "../authentication.middleware";

describe('Authentication Middleware', () => {
    let authMiddleware: AuthenticationMiddleware;
    let mockNextFunction: NextFunction = jest.fn();

    const mockRequest = (isAuthenticated: boolean = false, token: string = '') => {
        const req: Partial<Request> = {};
        if (isAuthenticated) {
            req.headers = {
                authorization: `Bearer ${token}`
            }
        }
        return req;
    };

    const mockResponse = () => {
        const res: Partial<Response> = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    let mockJsonWebTokenService: IJsonWebTokenService = {
        encode: jest.fn(() => Promise.resolve('anyString')),
        decode: jest.fn(() => Promise.resolve('anyString'))
    }

    beforeEach(() => {
        authMiddleware = new AuthenticationMiddleware(mockJsonWebTokenService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    
    
    describe('400 response', () => {
        const unauthorizedResp = {
            statusCode: 400,
            success: false,
            message: 'Unauthorized',
            error: null
        };

        let res: any;

        beforeEach(async () => {
            res = mockResponse();
            await authMiddleware.handler(mockRequest() as Request & { user: User }, res as Response, mockNextFunction);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });
        
        it('statusCode is 400', async () => {
            expect(res.status).toBeCalledWith(unauthorizedResp.statusCode);
            
        });
        
        it('400 JSON response', async () => {
            expect(res.json).toHaveBeenCalledWith(unauthorizedResp);
        });
    });

    describe('statusCode is 403', () => {
        const invalidTokenResp = {
            statusCode: 403,
            success: false,
            message: 'Invalid Token',
            error: null
        };

        let res: any;

        beforeEach(async () => {
            res = mockResponse();
            
            jest.spyOn(mockJsonWebTokenService, 'decode').mockImplementation(() => Promise.reject(''))
            await authMiddleware.handler(mockRequest(true, '') as Request & { user: User }, res as Response, mockNextFunction);
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('statusCode is 403', async () => {
            expect(res.status).toBeCalledWith(invalidTokenResp.statusCode);
        });

        it('403 JSON response', async () => {
            expect(res.json).toHaveBeenCalledWith(invalidTokenResp);
        });
    });

    describe('valid token', () => {
        let res: any;

        beforeEach(async () => {
            res = mockResponse();
            await authMiddleware.handler(mockRequest(true, 'anyString') as Request & { user: User }, res as Response, mockNextFunction);
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('On valid token', async () => {
            expect(mockNextFunction).toBeCalledTimes(1);
        });
    });
});