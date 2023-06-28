import 'reflect-metadata';
import { CartReponse } from '../../../shared/utils/response.utils';
import { fakeCartData, fakeCartItemData } from "../../../../tests/utils/fake.service";
import { fakeRestaurent, fakeUser } from "../../../../tests/utils/generate";
import { CartItemDto } from '../dto/cart-item.dto';
import { ICartRepository } from "../interfaces/ICart.repository";
import { CartService } from "../service/cart.service";

describe('Cart Service', () => {
    let cartService: CartService;

    const mockCartRepo: ICartRepository = {
        create: jest.fn(() => Promise.resolve(fakeCartData)),
        retrieve: jest.fn(() => Promise.resolve(fakeCartData)),
        update: jest.fn(() => Promise.resolve(fakeCartData)),
        delete: jest.fn(() => Promise.resolve(fakeCartData)),
    };

    const cartItemDto: CartItemDto = {
        uuid: fakeCartItemData[0].uuid,
        qty: fakeCartItemData[0].qty
    };

    beforeAll(() => {
        cartService = new CartService(mockCartRepo);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Call create method', () => {
        it('Create method response', async () => {
            const response = await cartService.create(cartItemDto, fakeUser.uuid, fakeRestaurent.uuid);
            expect(response.cart_amount).toEqual(fakeCartData.cart_amount);
        });

        it('Should call create method', async () => {
            await cartService.create(cartItemDto, fakeUser.uuid, fakeRestaurent.uuid);
            expect(mockCartRepo.create).toHaveBeenCalled();
        });

        it('Should call create method only once', async () => {
            await cartService.create(cartItemDto, fakeUser.uuid, fakeRestaurent.uuid);
            expect(mockCartRepo.create).toBeCalledTimes(1);
        });
    });

    describe('Call update method', () => {
        it('Update method response', async () => {
            jest.spyOn(mockCartRepo, 'update').mockImplementation(() => Promise.resolve(fakeCartData as CartReponse));
            const response = await cartService.update(cartItemDto, fakeUser.uuid, fakeCartData.uuid);
            expect(response.cart_amount).toEqual(fakeCartData.cart_amount);
        });

        it('Should call update method', async () => {
            await cartService.update(cartItemDto, fakeUser.uuid, fakeCartData.uuid);
            expect(mockCartRepo.update).toHaveBeenCalled();
        });

        it('Should call update method only once', async () => {
            await cartService.update(cartItemDto, fakeUser.uuid, fakeCartData.uuid);
            expect(mockCartRepo.update).toBeCalledTimes(1);
        });
    });
});