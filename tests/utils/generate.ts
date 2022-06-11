import { faker } from '@faker-js/faker';
import { User } from '../../src/modules/user/entity/user.entity';
import { UserRole, UserType, CurrentStatus } from '../../src/shared/utils/enum';

function generateUserData(object = {}): User {
    return {
        uuid: faker.datatype.uuid(),
        id: faker.datatype.number,
        email: faker.internet.email(),
        restaurent_id: 0,
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