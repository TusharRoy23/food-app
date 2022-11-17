import { faker } from '@faker-js/faker';
import { OrderItem, OrderDiscount, Order } from '../../src/modules/order/entity/index.entity';
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
        max_order_qty: faker.datatype.number({ min: 1, max: 100 }),
        min_order_qty: faker.datatype.number({ min: 1, max: 100 }),
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
        total_amount: +faker.commerce.price(),
        qty: faker.datatype.number({ min: 1, max: 50 }),
        item: generateItemData()[0],
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
        total_amount: +faker.commerce.price(),
        rebate_amount: 0,
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
        max_order_qty: faker.datatype.number({ min: 1, max: 100 }),
        min_order_qty: faker.datatype.number({ min: 1, max: 100 }),
        price: +faker.commerce.price(),
        item_status: ItemStatus.ACTIVE,
        discount_rate: 0,
        created_date: '2022-07-30 03:46:09',
    } as Item;
}

function demoOrderResponseItemData(object = {}) {
    return {
        uuid: faker.datatype.uuid(),
        amount: +faker.commerce.price(),
        qty: faker.datatype.number({ min: 1, max: 50 }),
        item: generateItemData()[0],
        deduction_rate: 0.0,
        total_amount: +faker.commerce.price(),
        ...object
    } as OrderItemResponse;
}

function demoOrder(object = {}) {
    return {
        id: +faker.datatype.number(),
        uuid: faker.datatype.uuid(),
        order_amount: +faker.commerce.price(),
        order_date: "2022-07-30 03:46:09",
        serial_number: `F-${Date.now()}`,
        rebate_amount: 0.0,
        paid_by: 'cash on delivery',
        order_status: 'pending',
        restaurent: generateRestaurentsData()[0],
        total_amount: +faker.commerce.price(),
    } as Order;
}

function generateOrderResponseItemData(n = 1, object = {}) {
    return Array.from({ length: n }, (_, i) => {
        return demoOrderResponseItemData({ ...object }) as OrderItemResponse
    })
}

function demoOrderResponseData(object = {}) {
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

function generateOrderResponseData(n = 1, object = {}) {
    return Array.from({ length: n }, (_, i) => {
        return demoOrderResponseData({ ...object });
    });
}

function demoOrderDiscount(object = {}) {
    return {
        id: +faker.datatype.number(),
        uuid: faker.datatype.uuid(),
        discount_rate: 0.0,
        start_date: '2022-11-01 00:00:00',
        end_date: '2022-11-30 00:00:09',
        max_amount: +faker.commerce.price(100, 300, 1),
        min_amount: +faker.commerce.price(10, 15, 1),
        created_date: '2022-11-01 00:00:00',
        restaurent: fakeRestaurents[0],
    } as OrderDiscount
}

function generateOrderDiscount(n = 1, object = {}) {
    return Array.from({ length: n }, (_, i) => {
        return demoOrderDiscount({ ...object });
    });
}

function demoOrderItemData(object = {}) {
    return {
        id: +faker.datatype.number(),
        uuid: faker.datatype.uuid(),
        amount: +faker.commerce.price(),
        item: demoItemData(),
        order: demoOrder(),
        qty: faker.datatype.number({ min: 1, max: 100 }),
        total_amount: +faker.commerce.price(),
    } as OrderItem
}

function generateOrderItem(n = 1, object = {}) {
    return Array.from({ length: n }, (_, i) => {
        return demoOrderItemData({ ...object });
    })
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
export const fakeOrderItemResponseData: Array<OrderItemResponse> = generateOrderResponseItemData(2);
export const fakeOrderData: OrderResponse = generateOrderResponseData(1, {
    order_item: generateOrderResponseItemData(2),
    restaurent: generateRestaurentsData()[0],
})[0];
export const fakeOrderDataList: OrderResponse[] = generateOrderResponseData(3, {
    order_item: generateOrderResponseItemData(3),
    restaurent: generateRestaurentsData()[0],
});
export const fakeOrderDiscount: Array<OrderDiscount> = generateOrderDiscount();
export const fakeOrderItem: Array<OrderItem> = generateOrderItem(3);
