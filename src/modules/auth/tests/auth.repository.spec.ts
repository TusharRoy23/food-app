import 'reflect-metadata';
import { User } from "../../user/entity/user.entity";
import { AuthRepository } from "../repository/auth.repository";
import { TokenResponse, UserResponse } from '../../../shared/utils/response.utils';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { RefreshTokenDto, SignInCredentialsDto, SignUpCredentialsDto } from '../dto/index.dto';
import { IJsonWebTokenService } from '../../../shared/interfaces/IJsonWebToken.service';
import { FakeRepository, fakeUser, accessToken, refreshToken } from "../../../../tests/utils/fake.service";
import { BadRequestException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '../../../shared/errors/all.exception';

describe('Auth Repository Test', () => {
    let authRepository: AuthRepository;
    const user: Partial<User> = {
        validatePassword: jest.fn(() => Promise.resolve(true))
    }

    const userResponse: UserResponse = {
        user: fakeUser,
        accessToken: accessToken,
        refreshToken: refreshToken
    };
    
    const payload: SignInCredentialsDto | SignUpCredentialsDto = {
        email: userResponse.user.email,
        password: 'Tushar2'
    };

    const tokenresponse: TokenResponse = {
        accessToken: accessToken,
        refreshToken: refreshToken
    }

    const refreshTokenPayload: RefreshTokenDto = {
        token: refreshToken
    };
    
    const fakeRepo = new FakeRepository();

    const fakeMethods = {
        findOne: fakeRepo.findOne(userResponse),
        create: fakeRepo.create(userResponse)
    };

    const dbService: IDatabaseService = {
        getRepository: jest.fn().mockImplementation(() => fakeMethods)
    }

    const jsonWebTokenService: IJsonWebTokenService = {
        encode: jest.fn(),
        decode: function (token: string, isAccessToken: boolean): Promise<string | {}> {
            throw new Error('Function not implemented.');
        }
    };

    beforeEach(async () => {
        authRepository = new AuthRepository(dbService, jsonWebTokenService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Repository', () => {
        it('getRepository method called', () => {
            const spy = jest.spyOn(dbService, 'getRepository');
            dbService.getRepository(User);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('SignIn Success', () => {
        it('Call SignIn function', async () => {
            const spy = jest.spyOn(authRepository, 'signIn').mockImplementation(() => Promise.resolve(userResponse));
            await authRepository.signIn(payload);
            expect(spy).toHaveBeenCalled();
        });
        
        it('Return SignIn Function', async () => {
            jest.spyOn(authRepository, 'signIn').mockImplementation(() => Promise.resolve(userResponse));
            const result = await authRepository.signIn(payload);
            expect(result.user.email).toEqual(userResponse.user.email);
        });

        it('Return AccessToken', async () => {
            jest.spyOn(authRepository, 'signIn').mockImplementation(() => Promise.resolve(userResponse));
            const result = await authRepository.signIn(payload);
            expect(result.accessToken).toEqual(userResponse.accessToken);
        });
        
        it('Return RefreshToken', async () => {
            jest.spyOn(authRepository, 'signIn').mockImplementation(() => Promise.resolve(userResponse));
            const result = await authRepository.signIn(payload);
            expect(result.refreshToken).toEqual(userResponse.refreshToken);
        });
    });

    describe('SignUp Success', () => {
        it('Call Add function', async () => {
            const spy = jest.spyOn(authRepository, 'add').mockImplementation(() => Promise.resolve('User successfully created !'));
            await authRepository.add(payload);
            expect(spy).toHaveBeenCalled();
        });
        
        it('Return Success Message', async () => {
            jest.spyOn(authRepository, 'add').mockImplementation(() => Promise.resolve('User successfully created !'));
            const result = await authRepository.add(payload);
            expect(result).toEqual('User successfully created !');
        });
    });

    describe('RegenerateToken Success', () => {
        it('Call RegenerateToken function', async () => {
            const spy = jest.spyOn(authRepository, 'regenerateToken').mockImplementation(() => Promise.resolve(tokenresponse));
            await authRepository.regenerateToken(refreshTokenPayload);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('SignIn Error', () => {
        it('NotFoundException', async () => {
            jest.spyOn(authRepository, 'signIn').mockImplementation(() => Promise.reject(new NotFoundException('User not found')));
            await expect(authRepository.signIn).rejects.toThrow(new NotFoundException('User not found'))
        });

        it('InternalServerErrorException', async () => {
            jest.spyOn(authRepository, 'signIn').mockImplementation(() => Promise.reject(new InternalServerErrorException('Error')));
            await expect(authRepository.signIn).rejects.toThrow(new InternalServerErrorException('Error'))
        });
    });

    describe('SignUp Error', () => {
        it('BadRequestException', async () => {
            jest.spyOn(authRepository, 'add').mockImplementation(() => Promise.reject(new BadRequestException('Email Already Exists!')));
            await expect(authRepository.add).rejects.toThrow(new BadRequestException('Email Already Exists!'))
        });

        it('InternalServerErrorException', async () => {
            jest.spyOn(authRepository, 'add').mockImplementation(() => Promise.reject(new InternalServerErrorException('Error')));
            await expect(authRepository.add).rejects.toThrow(new InternalServerErrorException('Error'))
        });
    });

    describe('RegenerateToken Error', () => {
        it('UnauthorizedException', async () => {
            jest.spyOn(authRepository, 'regenerateToken').mockImplementation(() => Promise.reject(new UnauthorizedException('Invalid Refresh Token')));
            await expect(authRepository.regenerateToken).rejects.toThrow(new UnauthorizedException('Invalid Refresh Token'));
        });
    });
});