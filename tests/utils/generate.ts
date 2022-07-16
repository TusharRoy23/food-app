import { faker } from '@faker-js/faker';
import { Restaurent } from 'src/modules/restaurent/entity/restaurent.entity';
import { UserInfo } from '../../src/modules/user/entity/user-info.entity';
import { User } from '../../src/modules/user/entity/user.entity';
import { UserRole, UserType, CurrentStatus } from '../../src/shared/utils/enum';

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
    } as unknown as User;
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

export const fakeUsers: Array<User> = generateUsersData(1);
export const fakeUser: User = fakeUsers[0];
export const accessToken: string = faker.datatype.uuid() + faker.datatype.uuid();
export const refreshToken: string = faker.datatype.uuid() + faker.datatype.uuid();
export const fakeRestaurents: Array<Restaurent> = generateRestaurentsData();
export const fakeRestaurent: Restaurent = fakeRestaurents[0];