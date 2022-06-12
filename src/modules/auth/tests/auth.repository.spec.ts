import 'reflect-metadata';
import { IDatabaseService } from '../../../core/interface/IDatabase.service';
import { FakeRepository, fakeUser } from "../../../../tests/utils/fake.service";
import { User } from "../../user/entity/user.entity";
import { SignInCredentialsDto, SignUpCredentialsDto } from '../dto/index.dto';
import { AuthRepository } from "../repository/auth.repository";
import { BadRequestException, InternalServerErrorException, NotFoundException } from '../../../shared/errors/all.exception';

describe('Auth Repository Test', () => {
    let authRepository: AuthRepository;
    const user: Partial<User> = {
        validatePassword: jest.fn(() => Promise.resolve(true))
    }

    const userResponse: User = fakeUser;
    const payload: SignInCredentialsDto | SignUpCredentialsDto = {
        email: userResponse.email,
        password: 'Tushar2'
    };
    
    const fakeRepo = new FakeRepository();

    const fakeMethods = {
        findOne: fakeRepo.findOne(userResponse),
        create: fakeRepo.create(userResponse)
    };

    const dbService: IDatabaseService = {
        getRepository: jest.fn().mockImplementation(() => fakeMethods)
    }

    beforeEach(async () => {
        authRepository = new AuthRepository(dbService);
    });

    afterEach(() => {
        jest.clearAllMocks();
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
            expect(result.email).toEqual(userResponse.email);
        });
    });

    describe('SignUp Success', () => {
        it('Call Add function', async () => {
            const spy = jest.spyOn(authRepository, 'add').mockImplementation(() => Promise.resolve('User successfully created !'));
            await authRepository.add(payload);
            expect(spy).toHaveBeenCalled();
        });
        
        it('Return Success Message', async () => {
            const spy = jest.spyOn(authRepository, 'add').mockImplementation(() => Promise.resolve('User successfully created !'));
            const result = await authRepository.add(payload);
            expect(result).toEqual('User successfully created !');
        });
    });

    describe('SignIn Error', () => {
        it('NotFoundException', async () => {
            jest.spyOn(authRepository, 'signIn').mockImplementation(() => Promise.reject(new NotFoundException('User not found')));
            await expect(authRepository.signIn(payload)).rejects.toThrow(new NotFoundException('User not found'))
        });

        it('InternalServerErrorException', async () => {
            jest.spyOn(authRepository, 'signIn').mockImplementation(() => Promise.reject(new InternalServerErrorException('Error')));
            await expect(authRepository.signIn(payload)).rejects.toThrow(new InternalServerErrorException('Error'))
        });
    });

    describe('SignUp Error', () => {
        it('BadRequestException', async () => {
            jest.spyOn(authRepository, 'add').mockImplementation(() => Promise.reject(new BadRequestException('Email Already Exists!')));
            await expect(authRepository.add(payload)).rejects.toThrow(new BadRequestException('Email Already Exists!'))
        });

        it('InternalServerErrorException', async () => {
            jest.spyOn(authRepository, 'add').mockImplementation(() => Promise.reject(new InternalServerErrorException('Error')));
            await expect(authRepository.add(payload)).rejects.toThrow(new InternalServerErrorException('Error'))
        });
    });
});