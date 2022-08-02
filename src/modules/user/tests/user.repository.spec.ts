import 'reflect-metadata';
import { dbService, fakeUser } from "../../../../tests/utils/fake.service";
import { UserRepository } from "../repository/user.repository";
import { User } from '../entity/user.entity';


describe('User Repository Test', () => {
    let userRepository: UserRepository;
    const userResponse: User = fakeUser;

    beforeEach(async () => {
        userRepository = new UserRepository(dbService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Repository', () => {
        it('getRepository method called', () => {
            dbService.getRepository(User);
            expect(dbService.getRepository).toHaveBeenCalled();
        });
    });

    describe('Success Responses', () => {
        it('getByUuid return user response', async () => {
            jest.spyOn(userRepository, 'getByUuid').mockImplementation(() => Promise.resolve(userResponse));
            const results = await userRepository.getByUuid(userResponse.uuid);
            expect(results.email).toEqual(userResponse.email);
        });

        it('getByUuid function called', async () => {
            const spy = jest.spyOn(userRepository, 'getByUuid').mockImplementation(() => Promise.resolve(userResponse));
            await userRepository.getByUuid(fakeUser.uuid);
            expect(spy).toHaveBeenCalled();
        });

        it('number of calls 1 in getByUuid', async () => {
            const spy = jest.spyOn(userRepository, 'getByUuid').mockImplementation(() => Promise.resolve(userResponse));
            await userRepository.getByUuid(fakeUser.uuid);
            expect(spy.mock.calls.length).toBe(1);
        });

    });

    describe('Error Responses', () => {
        it('getByUuid return no user', async () => {
            jest.spyOn(userRepository, 'getByUuid').mockImplementation(() => Promise.resolve(userResponse));
            const results = await userRepository.getByUuid(userResponse.uuid);
            expect(results.email).not.toEqual('test');
        });

        it('getByUuid function not called', async () => {
            const spy = jest.spyOn(userRepository, 'getByUuid').mockImplementation(() => Promise.resolve(userResponse));
            expect(spy).not.toHaveBeenCalled();
        });

        it('number of calls 0 in getByUuid', async () => {
            const spy = jest.spyOn(userRepository, 'getByUuid').mockImplementation(() => Promise.resolve(userResponse));
            expect(spy.mock.calls.length).toBe(0);
        });
    });
});