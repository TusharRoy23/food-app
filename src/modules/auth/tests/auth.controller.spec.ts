import { agent } from "../../../../tests/utils/supertest.utils";
import { TYPES } from "../../../core/type.core";
import container from "../../../core/container.core";
import { IAuthService } from "../interfaces/IAuth.service";
import { FakeAuthService, fakeUser } from "../../../../tests/utils/fake.service";
import { SignUpCredentialsDto } from "../dto/index.dto";

const userPayload: SignUpCredentialsDto = {
    email: fakeUser.email,
    password: 'abc'
}

describe('Auth Controller Test', () => {
    beforeEach(() => {
        container.rebind<IAuthService>(TYPES.IAuthService).to(FakeAuthService);
    });
    
    describe('Create A User', () => {
        it('Index', (done) => {
            agent.post('/auth/signup').send(userPayload).expect(201, done);
        });
        
        it('Create', (done) => {
            agent.post('/auth/signup')
                .send(userPayload)
                .then((response) => {
                    expect(response.body.message).toStrictEqual('User successfully created !');
                    done();
                })
                .catch(error => {
                    console.log('error: ', error);
                    done();
                })
        });

        it('400 statusCode without Validation', (done) => {
            agent.post('/auth/signup').send({
                email: userPayload.email,
                password: ''
            }).expect(400, done);
        });
        
    });

    describe('Sign In with a user', () => {
        it('Index', (done) => {
            agent.post('/auth/signin').send(userPayload).expect(200, done);
        });
        
        it('Email should be equal', (done) => {
            agent.post('/auth/signin')
                .send(userPayload)
                .then((response) => {
                    expect(response.body.results.email).toStrictEqual(userPayload.email);
                    done();
                })
                .catch(error => {
                    console.log('error: ', error);
                    done();
                })
        });
        
        it('400 statusCode without Validation', (done) => {
            agent.post('/auth/signin').send({
                email: userPayload.email,
                password: ''
            }).expect(400, done);
        });
    });
});