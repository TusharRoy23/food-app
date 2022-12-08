import 'reflect-metadata';
import { IAuthRepository } from "../interfaces/IAuth.repository";
import { AuthService } from "../service/auth.service";
import { RefreshTokenDto, SignInCredentialsDto } from "../dto/index.dto";
import { fakeUser, accessToken, refreshToken } from "../../../../tests/utils/fake.service";
import { TokenResponse, UserResponse } from '../../../shared/utils/response.utils';

describe('Auth Service Test', () => {
    let authService: AuthService;
    const userResponse: UserResponse = {
        user: fakeUser,
        accessToken: accessToken,
        refreshToken: refreshToken
    };
    const tokenResponse: TokenResponse = {
        accessToken: accessToken,
        refreshToken: refreshToken
    };

    const userPayload: SignInCredentialsDto = {
        email: userResponse.user.email,
        password: ""
    }

    const refreshTokenPayload: RefreshTokenDto = {
        token: refreshToken
    };

    const mockAuthRepo: IAuthRepository = {
        add: jest.fn(() => Promise.resolve('User successfully created !' as string)),
        signIn: jest.fn(() => Promise.resolve(userResponse)),
        regenerateToken: jest.fn(() => Promise.resolve(tokenResponse))
    };

    beforeEach(() => {
        authService = new AuthService(mockAuthRepo);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    
    
    describe('Call (add) method', () => {
        it('Should create a user', async () => {
            const response = await authService.createUser(userPayload);
            expect(response).toEqual('User successfully created !');
        });
    
        it('Should call (add) function of auth repository', async () => {
            await authService.createUser(userPayload);
            expect(mockAuthRepo.add).toHaveBeenCalled();
        });
        
        it('Should not call (add) function of auth repository without payload', () => {
            expect(mockAuthRepo.add).not.toHaveBeenCalledWith();
        });
    });
    
    describe('Call (signIn) function', () => {
        it('user can sign in', async () => {
            jest.spyOn(mockAuthRepo, 'signIn').mockImplementation(() => Promise.resolve(userResponse as UserResponse));
            const response = await authService.signIn(userPayload);
            expect(response.accessToken).toEqual(userResponse.accessToken);
        });
        
        it('Should call (signIn) function of auth repository', async () => {
            await authService.signIn(userPayload);
            expect(mockAuthRepo.signIn).toHaveBeenCalled();
        });

        it('Should not call (signIn) function of auth repository without payload', () => {
            expect(mockAuthRepo.signIn).not.toHaveBeenCalledWith();
        });
    });

    describe('Call (getAccessToken) function', () => {
        it('Should call regenerateToken function', async () => {
            await authService.getAccessToken(refreshTokenPayload);
            expect(mockAuthRepo.regenerateToken).toHaveBeenCalled();
        });
        
    });
});