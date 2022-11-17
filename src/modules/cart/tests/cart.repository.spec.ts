import 'reflect-metadata';
import { cartSharedRepo, dbService, fakeCartData, fakeCartItemData, fakeRestaurent, fakeUser, itemSharedRepo, restaurentSharedRepo, userSharedRepo } from "../../../../tests/utils/fake.service";
import { Cart } from "../entity/cart.entity";
import { CartRepository } from "../repository/cart.repository";
import { NotFoundException } from '../../../shared/errors/all.exception';
import { CartItemDto } from '../dto/cart-item.dto';


describe('Cart Repository Test', () => {
    let cartRepo: CartRepository;

    const cartItemDto: CartItemDto = { uuid: fakeCartItemData[0].uuid, qty: fakeCartItemData[0].qty };

    beforeAll(() => {
        cartRepo = new CartRepository(dbService, cartSharedRepo, restaurentSharedRepo, userSharedRepo, itemSharedRepo);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("Repository", () => {
        it("getRepository Method called", async () => {
            const spy = jest.spyOn(dbService, 'getRepository');
            dbService.getRepository(Cart);
            expect(spy).toHaveBeenCalled();
        })
    });

    describe("Create a cart", () => {
        it('Should call create method', async () => {
            const spy = jest.spyOn(cartRepo, 'create').mockReturnValue(Promise.resolve(fakeCartData));
            await cartRepo.create(cartItemDto, fakeUser.uuid, fakeRestaurent.uuid);
            expect(spy).toHaveBeenCalled();
        });

        it('Should call create method only once', async () => {
            const spy = jest.spyOn(cartRepo, 'create').mockImplementation(() => Promise.resolve(fakeCartData));
            await cartRepo.create(cartItemDto, fakeUser.uuid, fakeRestaurent.uuid);
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });

    describe("Retrieve a cart", () => {
        it('Should call retrieve method', async () => {
            const spy = jest.spyOn(cartRepo, 'retrieve').mockImplementation(() => Promise.resolve(fakeCartData));
            await cartRepo.retrieve(fakeCartData.uuid, fakeUser.uuid);
            expect(spy).toHaveBeenCalled();
        });

        it('Should call retrieve method only once', async () => {
            const spy = jest.spyOn(cartRepo, 'retrieve').mockImplementation(() => Promise.resolve(fakeCartData));
            await cartRepo.retrieve(fakeCartData.uuid, fakeUser.uuid);
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });

    describe("Cart Error", () => {
        it('Create error', async () => {
            jest.spyOn(cartRepo, 'create').mockImplementation(() => Promise.reject(new NotFoundException('Cart not found')));
            await expect(cartRepo.create).rejects.toThrow(new NotFoundException('Cart not found'));
        });

        it('Retrieve error', async () => {
            jest.spyOn(cartRepo, 'retrieve').mockImplementation(() => Promise.reject(new NotFoundException('Cart not found')));
            await expect(cartRepo.retrieve).rejects.toThrow(new NotFoundException('Cart not found'));
        });
    })
})