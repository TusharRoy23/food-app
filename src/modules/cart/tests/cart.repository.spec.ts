import 'reflect-metadata';
import { IDatabaseService } from "../../../core/interface/IDatabase.service"
import { fakeCartData, fakeCartItemData, FakeRepository, fakeRestaurent, fakeUser } from "../../../../tests/utils/fake.service";
import { Cart } from "../entity/cart.entity";
import { CartRepository } from "../repository/cart.repository";
import { CartDto } from '../dto/cart.dto';
import { NotFoundException } from '../../../shared/errors/all.exception';


describe('Cart Repository Test', () => {
    const fakeRepo = new FakeRepository();
    let cartRepo: CartRepository;

    const fakeMethods = {
        save: fakeRepo.save({}),
        update: fakeRepo.update({})
    };

    const cartDto: CartDto = {
        cart_item: [
            { uuid: fakeCartItemData[0].uuid, qty: fakeCartItemData[0].qty }
        ]
    }

    const dbService: IDatabaseService = {
        getRepository: jest.fn().mockImplementation(() => fakeMethods)
    }

    beforeEach(() => {
        cartRepo = new CartRepository(dbService);
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
            const spy = jest.spyOn(cartRepo, 'create').mockImplementation(() => Promise.resolve(fakeCartData));
            await cartRepo.create(cartDto, fakeUser.uuid, fakeRestaurent.uuid);
            expect(spy).toHaveBeenCalled();
        });

        it('Should call create method only once', async () => {
            const spy = jest.spyOn(cartRepo, 'create').mockImplementation(() => Promise.resolve(fakeCartData));
            await cartRepo.create(cartDto, fakeUser.uuid, fakeRestaurent.uuid);
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
            const spy = jest.spyOn(cartRepo, 'create').mockImplementation(() => Promise.reject(new NotFoundException('Cart not found')));
            await expect(cartRepo.create).rejects.toThrow(new NotFoundException('Cart not found'));
        });

        it('Retrieve error', async () => {
            const spy = jest.spyOn(cartRepo, 'retrieve').mockImplementation(() => Promise.reject(new NotFoundException('Cart not found')));
            await expect(cartRepo.retrieve).rejects.toThrow(new NotFoundException('Cart not found'));
        });
    })
})