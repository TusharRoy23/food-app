import { agent } from "../../../../tests/utils/supertest.utils";
import { injectable } from "inversify";
import { TYPES } from "../../../core/type.core";
import container from "../../../core/container.core";
import { fakeUser, fakeRestaurent } from "../../../../tests/utils/fake.service";
import { RegisterDto } from "../dto/index.dto";
import { IRestaurentService } from "../interfaces/IRestaurent.service";

@injectable()
class FakeRestaurentService implements IRestaurentService {
    register(registerDto: RegisterDto): Promise<string> {
        return Promise.resolve('Restaurent Successfully Created!');
    }
}
const payload: RegisterDto = {
    email: fakeUser.email,
    password: 'Tushar2',
    name: fakeRestaurent.name,
    address: fakeRestaurent.address,
    opening_time: fakeRestaurent.opening_time,
    closing_time: fakeRestaurent.closing_time
};

describe('Restaurent Controller Test', () => {
    beforeAll(() => {
        container.rebind<IRestaurentService>(TYPES.IRestaurentService).to(FakeRestaurentService);
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('Create A Restaurent', () => {
        it('Index', (done) => {
            agent.post('/restaurent/register').send(payload).expect(201, done);
        });

        it('Index', (done) => {
            agent.post('/restaurent/register')
                .send(payload)
                .then(response => {
                    expect(response.body.message).toStrictEqual('Restaurent Successfully Created!');
                    done();
                })
                .catch(error => {
                    console.log('error: ', error);
                    done();
                });
        });

        it('400 statusCode without Validation', (done) => {
            agent.post('/restaurent/register').send({
                email: payload.email,
                password: ''
            }).expect(400, done);
        });
    });
});