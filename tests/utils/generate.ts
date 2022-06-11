import { faker } from '@faker-js/faker';
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
            return generateUserData({ id: i, ...object }) as User;
        }
    );
}

export const fakeUsers: Array<User> = generateUsersData(1);
export const fakeUser: User = fakeUsers[0];