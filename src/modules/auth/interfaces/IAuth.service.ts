import { SignInCredentialsDto, SignUpCredentialsDto, RefreshTokenDto } from "../dto/index.dto";
import { UserResponse, TokenResponse } from "../../../shared/utils/response.utils";

export interface IAuthService {
    signIn(payload: SignInCredentialsDto): Promise<UserResponse>;
    createUser(user: SignUpCredentialsDto): Promise<string>;
    getAccessToken(refreshToken: RefreshTokenDto): Promise<TokenResponse>;
}