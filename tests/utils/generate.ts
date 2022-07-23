import { faker } from '@faker-js/faker';
import { CartItemResponse, CartReponse } from 'src/shared/utils/response.utils';
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
        name: faker.commerce.productName(),
        icon: '',
        image: '',
        item_type: ItemType.FOOD,
        meal_type: MealType.SNACKS,
        meal_state: MealState.HOT,
        meal_flavor: MealFlavor.SPICY,
        price: +faker.commerce.price(),
        discount_start_date: "2022-05-18T11:18:48.000Z".toString(),
        discount_end_date: "2022-05-20T11:19:48.000Z".toString(),
        discount_rate: 0,
        item_status: ItemStatus.ACTIVE,
        ...object
    } as Item;
}

function generateItemData(n = 1, object = {}) {
    return Array.from({
        length: n,
    }, (_, i) => {
        return demoItemData({ ...object }) as Item
    })
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

export const fakeUsers: Array<User> = generateUsersData(1);
export const fakeUser: User = fakeUsers[0];
export const accessToken: string = faker.datatype.uuid() + faker.datatype.uuid();
export const refreshToken: string = faker.datatype.uuid() + faker.datatype.uuid();
export const fakeRestaurents: Array<Restaurent> = generateRestaurentsData();
export const fakeRestaurent: Restaurent = fakeRestaurents[0];
export const fakeCart: CartReponse = generateCartData();
export const fakeCartItem: Array<CartItemResponse> = generateCartItemData();
export const fakeItemData: Array<Item> = generateItemData();