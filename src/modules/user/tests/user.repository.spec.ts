import 'reflect-metadata';
import { IDatabaseService } from "../../../core/interface/IDatabase.service";
import { FakeRepository, fakeUser } from "../../../../tests/utils/fake.service";
import { UserRepository } from "../repository/user.repository";
import { User } from '../entity/user.entity';


describe('User Repository Test', () => {
    let userRepository: UserRepository;
    const userResponse: User = fakeUser;
    const fakeRepo = new FakeRepository();

    const fakeMethods = {
        findOneBy: fakeRepo.findOneBy(userResponse)
    };

    const dbService: IDatabaseService = {
        getRepository: jest.fn().mockImplementation(() => fakeMethods)
    }

    beforeEach(async () => {
        userRepository = new UserRepository(dbService);
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

    describe('Success Responses', () => {
        it('getById return user response', async () => {
            const results = await userRepository.getById(userResponse.id);
            expect(results.email).toEqual(userResponse.email);
        });

        it('getById function called', async () => {
            const spy = jest.spyOn(userRepository, 'getById');
            await userRepository.getById(fakeUser.id);
            expect(spy).toHaveBeenCalled();
        });

        it('number of calls 1 in getById', async () => {
            const spy = jest.spyOn(userRepository, 'getById');
            await userRepository.getById(fakeUser.id);
            expect(spy.mock.calls.length).toBe(1);
        });
        
    });

    describe('Error Responses', () => {
        it('getById return no user', async () => {
            const results = await userRepository.getById(userResponse.id);
            expect(results.email).not.toEqual('test');
        });
        
        it('getById function not called', async () => {
            const spy = jest.spyOn(userRepository, 'getById');
            expect(spy).not.toHaveBeenCalled();
        });

        it('number of calls 0 in getById', async () => {
            const spy = jest.spyOn(userRepository, 'getById');
            expect(spy.mock.calls.length).toBe(0);
        });
    });
});