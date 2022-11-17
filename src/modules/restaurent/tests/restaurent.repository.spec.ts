import 'reflect-metadata';
import { dbService, FakeRepository, orderSharedRepo, restaurentSharedRepo, userSharedRepo } from "../../../../tests/utils/fake.service";
import { fakeRestaurent, fakeUser } from "../../../../tests/utils/fake.service";
import { RestaurentRepository } from "../repository/restaurent.repository";
import { Restaurent } from '../entity/restaurent.entity';
import { RegisterDto } from '../dto/register.dto';
import { BadRequestException, InternalServerErrorException } from '../../../shared/errors/all.exception';

describe('Restaurent Repository Tests', () => {
    let restaurentRepo: RestaurentRepository;

    const payload: RegisterDto = {
        email: fakeUser.email,
        password: 'Tushar2',
        name: fakeRestaurent.name,
        address: fakeRestaurent.address,
        opening_time: fakeRestaurent.opening_time,
        closing_time: fakeRestaurent.closing_time
    };

    beforeEach(() => {
        restaurentRepo = new RestaurentRepository(dbService, restaurentSharedRepo, orderSharedRepo, userSharedRepo);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Repository', () => {
        it('getRepository method called', async () => {
            const spy = jest.spyOn(dbService, 'getRepository');
            dbService.getRepository(Restaurent);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('register Success', () => {
        it('Call Register method', async () => {
            const spy = jest.spyOn(restaurentRepo, 'register').mockImplementation(() => Promise.resolve('Restaurent Successfully Created!'));
            await restaurentRepo.register(payload);
            expect(spy).toHaveBeenCalled();
        });

        it('Return Success message', async () => {
            await jest.spyOn(restaurentRepo, 'register').mockImplementation(() => Promise.resolve('Restaurent Successfully Created!'));
            const result = await restaurentRepo.register(payload);
            expect(result).toEqual('Restaurent Successfully Created!');
        });
    });

    describe('register Failed', () => {
        it('Throw InternalServerErrorException', async () => {
            await jest.spyOn(restaurentRepo, 'register').mockImplementation(() => Promise.reject(new InternalServerErrorException('Error')));
            expect(restaurentRepo.register).rejects.toThrow(new InternalServerErrorException('Error'));
        });

        it('Throw BadRequestException', async () => {
            await jest.spyOn(restaurentRepo, 'register').mockImplementation(() => Promise.reject(new BadRequestException('Email Already Exists!')));
            expect(restaurentRepo.register).rejects.toThrow(new BadRequestException('Email Already Exists!'));
        });
    })
});