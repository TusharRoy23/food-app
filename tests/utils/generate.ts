import { faker } from '@faker-js/faker';
import { Cart } from 'src/modules/cart/entity/cart.entity';
import { CartItemResponse, CartReponse, OrderItemResponse, OrderResponse } from 'src/shared/utils/response.utils';
import { Item } from '../../src/modules/item/entity/item.entity';
import { Restaurent } from '../../src/modules/restaurent/entity/restaurent.entity';
import { UserInfo } from '../../src/modules/user/entity/user-info.entity';
import { User } from '../../src/modules/user/entity/user.entity';
import { UserRole, UserType, CurrentStatus, CartStatus, ItemType, MealType, MealState, MealFlavor, ItemStatus } from '../../src/shared/utils/enum';

function generateUserData(object = {}): User {
    return {
        uuid: faker.datatype.uuid(),
        id: faker.datatype.number(),
        email: faker.internet.email(),
        restaurent: {},
        user_info: {
            id: faker.datatype.number(),
            uuid: faker.datatype.uuid(),
            name: faker.name.firstName()
        } as UserInfo,
        role: UserRole.NONE,
        user_type: UserType.VISITOR,
        current_status: CurrentStatus.ACTIVE,
        ...object,
    } as User;
}

function generateUsersData(n = 1, object = {}) {
    return Array.from(
        {
            length: n,
        },
        (_, i) => {
            return generateUserData({ ...object }) as User;
        }
    );
}

function generateRestaurentData(object = {}) {
    const date = new Date(faker.date.recent());
    return {
        uuid: faker.datatype.uuid(),
        id: faker.datatype.number(),
        name: faker.name.firstName(),
        address: faker.address.cityName(),
        profile_img: faker.image.city(),
        opening_time: '08:08:00',
        closing_time: '11:00:00'
    };
}

function generateRestaurentsData(n = 1, object = {}) {
    return Array.from(
        {
            length: n,
        },
        (_, i) => {
            return generateRestaurentData({ ...object }) as Restaurent;
        }
    );
}

function demoItemData(object = {}) {
    return {
        uuid: faker.datatype.uuid(),
        id: +faker.datatype.number(),
        name: faker.commerce.product(),
        icon: '',
        image: '',
        item_type: ItemType.FOOD,
        meal_type: MealType.SNACKS,
        meal_state: MealState.HOT,
        meal_flavor: MealFlavor.SPICY,
        price: +faker.commerce.price(),
        discount_start_date: String("2022-05-18T11:18:48.000Z"),
        discount_end_date: String("2022-05-20T11:19:48.000Z"),
        discount_rate: 0.0,
        item_status: ItemStatus.ACTIVE,
        ...object
    } as Item;
}

function generateItemData(n = 1, object = {}) {
    return Array.from({
        length: n,
    }, (_, i) => {
        return demoItemData({ ...object }) as Item
    }) as Item[]
}

function cartItemData(object = {}) {
    return {
        uuid: faker.datatype.uuid(),
        amount: +faker.commerce.price(),
        qty: faker.datatype.number({ min: 1, max: 50 }),
        item: generateItemData()[0]
    } as CartItemResponse;
}

function generateCartItemData(n = 1, object = {}) {
    return Array.from({
        length: n,
    }, (_, i) => {
        return cartItemData({ ...object }) as CartItemResponse
    })
}

function demoCartData(object = {}) {
    return {
        uuid: faker.datatype.uuid(),
        cart_date: faker.date.recent().toString(),
        cart_amount: +faker.commerce.price(),
        cart_status: CartStatus.SAVED,
        cart_item: generateCartItemData(3)
    } as CartReponse;
}

function generateCartData(object = {}) {
    return demoCartData({ ...object }) as CartReponse;
}

function itemPayload() {
    return {
        name: faker.commerce.product(),
        item_type: ItemType.DRINK,
        meal_type: MealType.BEVERAGE,
        meal_state: MealState.COLD,
        meal_flavor: MealFlavor.SWEET,
        discount_start_date: "2022-05-18 11:18:48",
        discount_end_date: "2022-05-20 11:19:48",
        price: +faker.commerce.price(),
        item_status: ItemStatus.ACTIVE,
        discount_rate: 0
    } as Item;
}

function demoOrderItemData(object = {}) {
    return {
        uuid: faker.datatype.uuid(),
        amount: +faker.commerce.price(),
        qty: faker.datatype.number({ min: 1, max: 50 }),
        item: generateItemData()[0],
        deduction_rate: 0.0,
        ...object
    } as OrderItemResponse;
}

function generateOrderItemData(n = 1, object = {}) {
    return Array.from({ length: n }, (_, i) => {
        return demoOrderItemData({ ...object }) as OrderItemResponse
    })
}

function demoOrderData(object = {}) {
    return {
        uuid: faker.datatype.uuid(),
        order_amount: +faker.commerce.price(),
        order_date: "2022-07-30 03:46:09",
        serial_number: `F-${Date.now()}`,
        rebate_amount: 0.0,
        paid_by: 'cash on delivery',
        order_status: 'pending',
        ...object
    } as OrderResponse;
}

function generateOrderData(object = {}) {
    return demoOrderData({ ...object });
}

export const fakeUsers: Array<User> = generateUsersData(1);
export const fakeUser: User = fakeUsers[0];
export const fakeOwnerUser: User = generateUsersData(1, { role: UserRole.OWNER })[0];
export const accessToken: string = faker.datatype.uuid() + faker.datatype.uuid();
export const refreshToken: string = faker.datatype.uuid() + faker.datatype.uuid();
export const fakeRestaurents: Array<Restaurent> = generateRestaurentsData();
export const fakeRestaurent: Restaurent = fakeRestaurents[0];
export const fakeCart: CartReponse = generateCartData();
export const fakeCartItem: Array<CartItemResponse> = generateCartItemData();
export const fakeItemData: Array<Item> = generateItemData();
export const fakeItemPayload: Item = itemPayload();
export const fakeOrderItemData: Array<OrderItemResponse> = generateOrderItemData(2);
export const fakeOrderData: OrderResponse = generateOrderData({
    order_item: generateOrderItemData(2),
    restaurent: generateRestaurentsData()[0],
});
