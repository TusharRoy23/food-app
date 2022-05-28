import 'reflect-metadata';
import { IAuthRepository } from "../interfaces/IAuth.repository";
import { AuthService } from "../service/auth.service";
import { User } from "../../user/entity/user.entity";
import { SignInCredentialsDto } from "../dto/index.dto";
import { fakeUser } from "../../../../tests/utils/generate";

describe('Auth Service Test', () => {
    let authService: AuthService;
    const userResponse: User = fakeUser;

    const userPayload: SignInCredentialsDto = {
        email: userResponse.email,
        password: ""
    }

    const mockAuthRepo: IAuthRepository = {
        add: jest.fn(() => Promise.resolve('User successfully created !')),
        signIn: jest.fn(() => Promise.resolve(userResponse)),
    };

    beforeEach(() => {
        authService = new AuthService(mockAuthRepo);
    });
    
    describe('Call (add) method', () => {
        it('Should create a user', async () => {
            const response = await authService.createUser(userPayload);
            expect(response).toEqual('User successfully created !');
        });
    
        it('Should call (add) function of auth repository', () => {
            const spy = jest.spyOn(mockAuthRepo, 'add');
            expect(spy).toHaveBeenCalled();
        });
        
        it('Should not call (add) function of auth repository without payload', () => {
            const add = jest.spyOn(mockAuthRepo, 'add');
            expect(add).not.toHaveBeenCalledWith();
        });
    });
    
    describe('Call (signIn) function', () => {
        it('user can sign in', async () => {
            const response = await authService.signIn(userPayload);
            expect(response).toEqual(userResponse);
        });
        
        it('Should call (signIn) function of auth repository', () => {
            const spy = jest.spyOn(mockAuthRepo, 'signIn');
            expect(spy).toHaveBeenCalled();
        });

        it('Should not call (signIn) function of auth repository without payload', () => {
            const signIn = jest.spyOn(mockAuthRepo, 'signIn');
            expect(signIn).not.toHaveBeenCalledWith();
        });
    });
});