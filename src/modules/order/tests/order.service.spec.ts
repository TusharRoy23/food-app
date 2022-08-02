import 'reflect-metadata';
import { OrderResponse } from "../../../shared/utils/response.utils";
import { fakeCartData, fakeOrder, fakeUser } from '../../../../tests/utils/fake.service';
import { OrderDto } from "../dto/order.dto";
import { IOrderRepository } from "../interfaces/IOrder.repository";
import { OrderService } from "../service/order.service";
import { NotFoundException } from '../../../shared/errors/all.exception';

describe("Order Service Test", () => {
    let orderService: OrderService;

    const mockOrderRepo: IOrderRepository = {
        submitOrder: function (orderDto: OrderDto, userUuid: string): Promise<OrderResponse> {
            return Promise.resolve(fakeOrder);
        }
    };

    const orderDto: OrderDto = {
        uuid: fakeCartData.uuid
    }

    beforeEach(() => {
        orderService = new OrderService(mockOrderRepo);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("Call submitOrder method", () => {
        it('Should call submitOrder method', () => {
            const spy = jest.spyOn(orderService, 'submitOrder');
            orderService.submitOrder(orderDto, fakeUser.uuid);
            expect(spy).toHaveBeenCalled();
        });

        it('Should call submitOrder method only once', () => {
            const spy = jest.spyOn(orderService, 'submitOrder');
            orderService.submitOrder(orderDto, fakeUser.uuid);
            expect(spy).toHaveBeenCalledTimes(1);
        });
    });

    describe("Create a order", () => {
        it("Create Order", async () => {
            const response = await orderService.submitOrder(orderDto, fakeUser.uuid);
            expect(response.uuid).toEqual(fakeOrder.uuid);
        })
    });

    describe("Exception on Order", () => {
        it("Should Occur NotFoundException", async () => {
            jest.spyOn(orderService, 'submitOrder').mockImplementation(() => Promise.reject(new NotFoundException('Not Found')));
            expect(orderService.submitOrder).rejects.toThrow(new NotFoundException('Not Found'));
        })
    })
});