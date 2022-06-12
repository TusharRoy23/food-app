import { User } from "../../modules/user/entity/user.entity";

export class UserResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export class TokenResponse {
    accessToken: string;
    refreshToken: string;
}