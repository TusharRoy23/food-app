import 'reflect-metadata';
import { User } from "../entity/user.entity";
import { fakeUser } from "../../../../tests/utils/generate";
import { UserService } from "../service/user.service";
import { IUserRepository } from "../interfaces/IUser.repository";

describe('User Service Test', () => {
    let userService: UserService;
    const userResponse: User = fakeUser;

    const mockUserRepo: IUserRepository = {
        getById: jest.fn(() => Promise.resolve(userResponse)),
    }

    beforeAll(() => {
        userService = new UserService(mockUserRepo);
    });
    
    describe('Call (getById) method', () => {
        it('Should return a user', async () => {
            const test = await userService.getUser(userResponse.id);
            expect(test).toEqual(userResponse);
        });
        
        it('Should call (getById) of auth repository', () => {
            expect(mockUserRepo.getById).toHaveBeenCalled();
        });
    
        it('Should not call (getById) of auth repository without ID', () => {
            const getById = jest.spyOn(mockUserRepo, 'getById');
            expect(getById).not.toHaveBeenCalledWith();
        });
    });
});