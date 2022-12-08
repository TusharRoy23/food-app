import { RefreshTokenDto, SignInCredentialsDto, SignUpCredentialsDto } from '../dto/index.dto';
import { UserResponse, TokenResponse } from '../../../shared/utils/response.utils';

export interface IAuthRepository {
    add(user: SignUpCredentialsDto): Promise<string>;
    signIn(payload: SignInCredentialsDto): Promise<UserResponse>;
    regenerateToken(refreshToken: RefreshTokenDto): Promise<TokenResponse>;
}