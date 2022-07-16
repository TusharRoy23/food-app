import { agent } from "../../../../tests/utils/supertest.utils";
import { injectable } from "inversify";
import { TYPES } from "../../../core/type.core";
import container from "../../../core/container.core";
import { fakeUser, fakeRestaurent, fakeRestaurentList } from "../../../../tests/utils/fake.service";
import { RegisterDto } from "../dto/index.dto";
import { IRestaurentService } from "../interfaces/IRestaurent.service";
import { Restaurent } from "../entity/restaurent.entity";

@injectable()
class FakeRestaurentService implements IRestaurentService {
    list(): Promise<Restaurent[]> {
        return Promise.resolve(fakeRestaurentList);
    }
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
        it('Response should be 201', (done) => {
            agent.post('/restaurent/register').send(payload).expect(201, done);
        });

        it('Register', (done) => {
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

    describe('Restaurent List', () => {
        it('Response should be 200', (done) => {
            agent.get('/restaurent/list').expect(200, done);
        });

        it('Get Restaurent List', (done) => {
            agent.get('/restaurent/list')
                .then(response => {
                    const restaurents = response.body.results;
                    expect(restaurents[0].name).toEqual(fakeRestaurentList[0].name);
                    done();
                })
                .catch(error => {
                    console.log('error: ', error);
                    done();
                })
        });
    });
});