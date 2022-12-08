import { agent } from "../../../../tests/utils/supertest.utils";
import { TYPES } from "../../../core/type.core";
import container from "../../../core/container.core";
import { IAuthService } from "../interfaces/IAuth.service";
import { FakeAuthService, fakeUser, refreshToken } from "../../../../tests/utils/fake.service";
import { RefreshTokenDto, SignUpCredentialsDto } from "../dto/index.dto";
import { IJsonWebTokenService } from "src/shared/interfaces/IJsonWebToken.service";

const userPayload: SignUpCredentialsDto = {
    email: fakeUser.email,
    password: 'abc'
}

const refreshTokenPayload: RefreshTokenDto = {
    token: refreshToken
};

let jsonWebTokenService: IJsonWebTokenService;
let accessToken: string;

describe('Auth Controller Test', () => {
    beforeAll(() => {
        container.rebind<IAuthService>(TYPES.IAuthService).to(FakeAuthService);
        jsonWebTokenService = container.get<IJsonWebTokenService>(TYPES.IJsonWebTokenService);
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    beforeEach(async () => {
        accessToken = await jsonWebTokenService.encode(fakeUser, true);
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
                    expect(response.body.results.user.email).toStrictEqual(userPayload.email);
                    done();
                })
                .catch(error => {
                    console.log('error: ', error);
                    done();
                })
        });

        it('Should return UserInfo', (done) => {
            agent.post('/auth/signin')
                .send(userPayload)
                .then((response) => {
                    expect(response.body.results.user.user_info.uuid).toStrictEqual(fakeUser.user_info.uuid);
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

    describe('Regenerate Refresh Token', () => {
        it('Index', (done) => {
            agent.post('/auth/refresh-token')
                .send(refreshTokenPayload)
                .set("Authorization", `Bearer ${accessToken}`)
                .expect(200, done);
        });
        
        it('Refresh should not equal', (done) => {
            agent.post('/auth/refresh-token')
                .send(refreshTokenPayload)
                .set("Authorization", `Bearer ${accessToken}`)
                .then((response) => {
                    expect(response.body.results.refreshToken).toStrictEqual(refreshTokenPayload.token);
                    done();
                })
                .catch(error => {
                    console.log('error: ', error);
                    done();
                });
        });
        
    });
});