import { injectable } from "inversify";
import { IUserService } from "../../src/modules/user/interfaces/IUser.service";
import { IAuthService } from "../../src/modules/auth/interfaces/IAuth.service";
import { User } from "../../src/modules/user/entity/user.entity";
import { RefreshTokenDto, SignInCredentialsDto, SignUpCredentialsDto } from "../../src/modules/auth/dto/index.dto";
import { fakeUsers, fakeRestaurents, accessToken as AcsTkn, refreshToken as RefrhTkn } from "./generate";
import { UserInfo } from "../../src/modules/user/entity/user-info.entity";
import { TokenResponse, UserResponse } from "../../src/shared/utils/response.utils";
import { Restaurent } from "../../src/modules/restaurent/entity/restaurent.entity";
import { RegisterDto } from "../../src/modules/restaurent/dto/register.dto";
import { IRestaurentService } from "../../src/modules/restaurent/interfaces/IRestaurent.service";

// export const users: Array<User> = generateUsersData(1);
export const fakeUser: User = fakeUsers[0];
export const accessToken: string = AcsTkn;
export const refreshToken: string = RefrhTkn;
export const fakeRestaurent: Restaurent = fakeRestaurents[0];

@injectable()
export class FakeAuthService implements IAuthService {
    signIn(payload: SignInCredentialsDto): Promise<UserResponse> {
        return Promise.resolve({
            user: fakeUser,
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    }
    createUser(user: SignUpCredentialsDto): Promise<string> {
        return Promise.resolve('User successfully created !');
    }
    getAccessToken(payload: RefreshTokenDto): Promise<TokenResponse> {
        return Promise.resolve({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    }
}

@injectable()
export class FakeUserService implements IUserService {
    async getUser(uuid: string): Promise<User> {
        return await Promise.resolve(fakeUser);
    }
}

export class FakeRepository {
    findOne(response: any) {
        return jest.fn(() => Promise.resolve(response))
    }
    create(response: any) {
        return jest.fn(() => Promise.resolve(response))
    }
    save(response: any) {
        return jest.fn(() => Promise.resolve(response))
    }
    update(response: any) {
        return jest.fn(() => Promise.resolve(response))
    }
}