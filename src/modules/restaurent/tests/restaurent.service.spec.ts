import 'reflect-metadata';
import { fakeUser, fakeRestaurent } from "../../../../tests/utils/fake.service";
import { RegisterDto } from "../dto/index.dto";
import { IRestaurentRepository } from "../interfaces/IRestaurent.repository";
import { RestaurentService } from "../service/restaurent.service";

describe('Restaurent Service Test', () => {
    let restaurentService: RestaurentService;
    const payload: RegisterDto = {
        email: fakeUser.email,
        password: 'Tushar2',
        name: fakeRestaurent.name,
        address: fakeRestaurent.address,
        opening_time: fakeRestaurent.opening_time,
        closing_time: fakeRestaurent.closing_time
    };

    const mockRestaurentRepo: IRestaurentRepository = {
        register: jest.fn(() => Promise.resolve('Restaurent Successfully Created!' as string))
    };

    beforeEach(() => {
        restaurentService = new RestaurentService(mockRestaurentRepo);
    });

    describe('Call register method', () => {
        it('Should call ', async () => {
            await restaurentService.register(payload);
            expect(mockRestaurentRepo.register).toHaveBeenCalled();
        });

        it('Should create a restaurent', async () => {
            const response = await restaurentService.register(payload);
            expect(response).toEqual('Restaurent Successfully Created!');
        });
    });
});