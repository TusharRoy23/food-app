import { injectable } from "inversify";
import { agent } from "../../../../tests/utils/supertest.utils";
import container from "../../../core/container.core";
import { TYPES } from "../../../core/type.core";
import { IJsonWebTokenService } from "../../../shared/interfaces/IJsonWebToken.service";
import { CartReponse } from "../../../shared/utils/response.utils";
import { fakeCartData, fakeCartItemData, fakeItem, fakeUser } from "../../../../tests/utils/fake.service";
import { fakeRestaurent } from "../../../../tests/utils/generate";
import { CartItemDto } from "../dto/cart-item.dto";
import { ICartService } from "../interfaces/ICart.service";

@injectable()
export class FakeCartService implements ICartService {
    create(cartItemDto: CartItemDto, userUuid: string, restaurentUuid: string): Promise<CartReponse> {
        return Promise.resolve(fakeCartData);
    }
    retrieve(cartUuid: string, userUuid: string): Promise<CartReponse> {
        return Promise.resolve(fakeCartData);
    }
    update(cartItemDto: CartItemDto, userUuid: string, cartUuid: string): Promise<CartReponse> {
        return Promise.resolve(fakeCartData);
    }
    delete(itemUuid: string, cartUuid: string, userUuid: string): Promise<CartReponse> {
        return Promise.resolve(fakeCartData);
    }
}

const cartItemDto: CartItemDto = {
    uuid: fakeCartItemData[0].uuid,
    qty: fakeCartItemData[0].qty
};

describe('Cart Controller', () => {
    let accessToken: string;
    let jsonWebTokenService: IJsonWebTokenService;

    beforeAll(() => {
        container.rebind<ICartService>(TYPES.ICartService).to(FakeCartService);
        jsonWebTokenService = container.get<IJsonWebTokenService>(TYPES.IJsonWebTokenService);
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    beforeEach(async () => {
        accessToken = await jsonWebTokenService.encode(fakeUser, true);
    });

    describe('Create a Cart', () => {
        it('Index', (done) => {
            agent.post(`/cart/restaurent/${fakeRestaurent.uuid}`)
                .send(cartItemDto)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201, done);
        });
    });

    describe('Update a Cart', () => {
        it('Index', (done) => {
            agent.post(`/cart/${fakeCartData.uuid}`)
                .send(cartItemDto)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201, done);
        });
    });

    describe('Delete a Cart', () => {
        it('Index', (done) => {
            agent.delete(`/cart/${fakeCartData.uuid}/${fakeItem.uuid}`)
                .send(cartItemDto)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(204, done);
        });
    });
});