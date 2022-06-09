import { agent } from '../../../../tests/utils/supertest.utils';
import { TYPES } from '../../../core/type.core';
import container from '../../../core/container.core';
import { FakeUserService, fakeUser } from '../../../../tests/utils/fake.service';
import { IUserService } from '../interfaces/IUser.service';
import { IJsonWebTokenService } from '../../../shared/interfaces/IJsonWebToken.service';

let jsonWebTokenService: IJsonWebTokenService;
let accessToken: string;

describe('User Controller Test', () => {
    beforeAll(() => {
        container.rebind<IUserService>(TYPES.IUserService).to(FakeUserService);
        jsonWebTokenService = container.get<IJsonWebTokenService>(TYPES.IJsonWebTokenService);
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    beforeEach(async () => {
        accessToken = await jsonWebTokenService.encode(fakeUser, true);
    });

    describe('Get A User', () => {
        it('Index', (done) => {
            agent.get(`/users/${fakeUser.uuid}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200, done);
        });
    
        it('Should Responsed with a user', (done) => {
            agent.get(`/users/${fakeUser.uuid}`)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200)
                .then((response) => {
                    expect(response.body.results.user_info.uuid).toStrictEqual(fakeUser.user_info.uuid);
                    done();
                })
                .catch(error => {
                    console.log('error: ', error);
                    done();
                })
        });
    });
});