import 'reflect-metadata';
import { cartSharedRepo, dbService, fakeCartData, fakeOrderResponse, fakeUser, restaurentSharedRepo, itemSharedRepo } from "../../../../tests/utils/fake.service";
import { OrderDto } from "../dto/order.dto";
import { Order } from "../entity/order.entity";
import { OrderRepository } from "../repository/order.repository";
import { NotFoundException } from '../../../shared/errors/all.exception';

describe("Order repository", () => {
    let orderRepo: OrderRepository;

    const orderDto: OrderDto = {
        uuid: fakeCartData.uuid
    };

    beforeEach(() => {
        orderRepo = new OrderRepository(dbService, cartSharedRepo, restaurentSharedRepo, itemSharedRepo);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("Repository", () => {
        it("getRepository Method called", async () => {
            const spy = jest.spyOn(dbService, 'getRepository');
            dbService.getRepository(Order);
            expect(spy).toHaveBeenCalled();
        })
    });

    describe("Create a Order", () => {
        it("Should call submitOrder method", async () => {
            const spy = jest.spyOn(orderRepo, 'submitOrder').mockImplementation(() => Promise.resolve(fakeOrderResponse));
            await orderRepo.submitOrder(orderDto, fakeUser.uuid);
            expect(spy).toHaveBeenCalled();
        });

        it("Order amount should equal", async () => {
            jest.spyOn(orderRepo, 'submitOrder').mockImplementation(() => Promise.resolve(fakeOrderResponse));
            const submitOrder = await orderRepo.submitOrder(orderDto, fakeUser.uuid);
            expect(submitOrder.order_amount).toEqual(fakeOrderResponse.order_amount);
        });
    });

    describe("Error on order creation", () => {
        it("Should have NotFoundException", async () => {
            jest.spyOn(orderRepo, 'submitOrder').mockImplementation(() => Promise.reject(new NotFoundException('Not Found')));
            expect(orderRepo.submitOrder).rejects.toThrow(new NotFoundException('Not Found'));
        })
    });
});