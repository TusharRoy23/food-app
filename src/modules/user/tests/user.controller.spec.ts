import { agent } from '../../../../tests/utils/supertest.utils';
import { TYPES } from '../../../core/type.core';
import container from '../../../core/container.core';
import { FakeUserService, fakeUser } from '../../../../tests/utils/fake.service';
import { IUserService } from '../interfaces/IUser.service';

describe('User Controller Test', () => {
    beforeAll(() => {
        container.rebind<IUserService>(TYPES.IUserService).to(FakeUserService);
    });

    describe('Get A User', () => {
        it('Index', (done) => {
            agent.get(`/users/${fakeUser.uuid}`).expect(200, done);
        });
    
        it('Should Responsed with a user', (done) => {
            agent.get(`/users/${fakeUser.uuid}`)
                .expect(200)
                .then((response) => {
                    expect(response.body.results.email).toStrictEqual(fakeUser.email);
                    done();
                })
                .catch(error => {
                    console.log('error: ', error);
                    done();
                })
        });
    });
});