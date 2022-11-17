import { injectable } from "inversify";
import { IUserService } from "../../src/modules/user/interfaces/IUser.service";
import { IAuthService } from "../../src/modules/auth/interfaces/IAuth.service";
import { User } from "../../src/modules/user/entity/user.entity";
import { RefreshTokenDto, SignInCredentialsDto, SignUpCredentialsDto } from "../../src/modules/auth/dto/index.dto";
import { fakeUsers, fakeRestaurents, accessToken as AcsTkn, refreshToken as RefrhTkn, fakeCart, fakeCartItem, fakeItemData, fakeOwnerUser, fakeItemPayload, fakeOrderData, fakeOrderItemResponseData, fakeOrderDiscount, fakeOrderDataList, fakeOrderItem } from "./generate";
import { CartItemResponse, CartReponse, OrderItemResponse, OrderResponse, TokenResponse, UserResponse } from "../../src/shared/utils/response.utils";
import { Restaurent } from "../../src/modules/restaurent/entity/restaurent.entity";
import { Item } from "../../src/modules/item/entity/item.entity";
import { Cart, CartItem } from "../../src/modules/cart/entity/index.entity";
import { ICartSharedRepo, IRestaurentSharedRepo, IUserSharedRepo, IItemSharedRepository, IOrderSharedRepository } from "../../src/shared/interfaces/IIndexShared.repository";
import { IDatabaseService } from "../../src/core/interface/IDatabase.service";
import { OrderDiscount, OrderItem } from "../../src/modules/order/entity/index.entity";

// export const users: Array<User> = generateUsersData(1);
export const fakeUser: User = fakeUsers[0];
export const fakerOwner: User = fakeOwnerUser;
export const accessToken: string = AcsTkn;
export const refreshToken: string = RefrhTkn;
export const fakeRestaurent: Restaurent = fakeRestaurents[0];
export const fakeRestaurentList: Restaurent[] = fakeRestaurents;
export const fakeCartData: CartReponse = fakeCart;
export const fakeCartItemData: CartItemResponse[] = fakeCartItem;
export const fakeItem: Item = fakeItemData[0];
export const fakeItemList: Item[] = fakeItemData;
export const fakeItemObject: Item = fakeItemPayload;
export const fakeOrderResponse: OrderResponse = fakeOrderData;
export const fakeOrderResponseList: OrderResponse[] = fakeOrderDataList;
export const fakeOrderItemResponse: OrderItemResponse[] = fakeOrderItemResponseData;
export const fakeOrderDiscountList: OrderDiscount[] = fakeOrderDiscount;
export const fakeOrderItemList: OrderItem[] = fakeOrderItem;

export const cartItemData: CartItem = {
    id: 2,
    uuid: fakeCartItemData[0].uuid,
    item: fakeCartItemData[0].item,
    qty: fakeCartItemData[0].qty,
    amount: fakeCartItemData[0].amount,
    total_amount: 0
}

export const cartData: Cart = {
    id: 1,
    uuid: fakeCartData.uuid,
    user: fakeUser,
    restaurent: fakeRestaurent,
    cart_item: [cartItemData],
    cart_amount: fakeCartData.cart_amount,
    cart_date: fakeCartData.cart_date,
    cart_status: fakeCartData.cart_status,
    order_discount: fakeOrderDiscountList[0],
    total_amount: 0,
    rebate_amount: 0,
    validate: jest.fn(),
    toJSON: jest.fn(),
}

export const cartSharedRepo: ICartSharedRepo = {
    cartInfo: jest.fn(() => Promise.resolve(cartData)),
    cartItemInfo: jest.fn(() => Promise.resolve(cartItemData)),
    cartItemsInfo: jest.fn(() => Promise.resolve([cartItemData])),
};

@injectable()
export class FakeAuthService implements IAuthService {
    signIn(payload: SignInCredentialsDto): Promise<UserResponse> {
        return Promise.resolve({
            user: fakeUser,
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    }
    createUser(user: SignUpCredentialsDto): Promise<string> {
        return Promise.resolve('User successfully created !');
    }
    getAccessToken(payload: RefreshTokenDto): Promise<TokenResponse> {
        return Promise.resolve({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    }
}

@injectable()
export class FakeUserService implements IUserService {
    async getUser(uuid: string): Promise<User> {
        return await Promise.resolve(fakeUser);
    }
}

export class FakeRepository {
    findOne(response: any) {
        return jest.fn(() => Promise.resolve(response))
    }
    create(response: any) {
        return jest.fn(() => Promise.resolve(response))
    }
    save(response: any) {
        return jest.fn(() => Promise.resolve(response))
    }
    update(response: any) {
        return jest.fn(() => Promise.resolve(response))
    }
}

const fakeRepo = new FakeRepository();

const fakeMethods = {
    save: fakeRepo.save({}),
    update: fakeRepo.update({}),
    findOne: fakeRepo.findOne({})
};

export const dbService: IDatabaseService = {
    getRepository: jest.fn().mockImplementation(() => fakeMethods)
}

export const restaurentSharedRepo: IRestaurentSharedRepo = {
    restaurentInfo: jest.fn(() => Promise.resolve(fakeRestaurent)),
    restaurentOrderDiscount: jest.fn(() => Promise.resolve(fakeOrderDiscountList[0]))
};

export const userSharedRepo: IUserSharedRepo = {
    userInfo: jest.fn(() => Promise.resolve(fakeUser)),
};

export const itemSharedRepo: IItemSharedRepository = {
    restaurentItemInfo: jest.fn(() => Promise.resolve(fakeItemData[0])),
}

export const orderSharedRepo: IOrderSharedRepository = {
    getOrderItemInfo: jest.fn(() => Promise.resolve(fakeOrderItemList)),
}