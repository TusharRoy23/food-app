import { injectable } from "inversify";
import { agent } from "../../../../tests/utils/supertest.utils";
import container from "../../../core/container.core";
import { TYPES } from "../../../core/type.core";
import { IJsonWebTokenService } from "../../../shared/interfaces/IJsonWebToken.service";
import { OrderResponse } from "../../../shared/utils/response.utils";
import { fakeCartData, fakeOrderResponse, fakeOrderResponseList, fakeUser } from "../../../../tests/utils/fake.service";
import { OrderDto } from "../dto/order.dto";
import { IOrderService } from "../interfaces/IOrder.service";

@injectable()
export class FakeOrderService implements IOrderService {
    getOrdersByUser(userUuid: string): Promise<OrderResponse[]> {
        return Promise.resolve(fakeOrderResponseList);
    }
    submitOrder(orderDto: OrderDto, userUuid: string): Promise<OrderResponse> {
        return Promise.resolve(fakeOrderResponse);
    }
}

const orderDto: OrderDto = {
    uuid: fakeCartData.uuid
}

describe("Order Controller Tests", () => {
    let accessToken: string;
    let jsonWebTokenService: IJsonWebTokenService;

    beforeAll(() => {
        container.rebind<IOrderService>(TYPES.IOrderService).to(FakeOrderService);
        jsonWebTokenService = container.get<IJsonWebTokenService>(TYPES.IJsonWebTokenService);
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    beforeEach(async () => {
        accessToken = await jsonWebTokenService.encode(fakeUser, true);
    });

    describe("Create a Order", () => {
        it('Index', (done) => {
            agent.post(`/order`)
                .send(orderDto)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201, done);
        });
    });

    describe("Create a Order", () => {
        it('201 on Order Create', (done) => {
            agent.post(`/order`)
                .send(orderDto)
                .set('Authorization', `Bearer ${accessToken}`)
                .then((response) => {
                    expect(response.body.results.uuid).toStrictEqual(fakeOrderResponse.uuid);
                    done();
                })
                .catch((error) => {
                    console.log(error);
                    done();
                })
        });

        it('400 on Order Create', (done) => {
            agent.post(`/order`)
                .send({})
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(400, done);
        });
    })
});