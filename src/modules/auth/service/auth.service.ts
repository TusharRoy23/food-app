import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { IAuthRepository } from '../interfaces/IAuth.repository';
import { IAuthService } from '../interfaces/IAuth.service';
import { RefreshTokenDto, SignInCredentialsDto, SignUpCredentialsDto } from '../dto/index.dto';
import { UserResponse, TokenResponse } from '../../../shared/utils/response.utils';

@injectable()
export class AuthService implements IAuthService {
    constructor(
        @inject(TYPES.IAuthRepository) private authRepository: IAuthRepository
    ) {}
    
    async signIn(payload: SignInCredentialsDto): Promise<UserResponse> {
        return await this.authRepository.signIn(payload);
    }
    
    public async createUser(user: SignUpCredentialsDto): Promise<string> {
        return await this.authRepository.add(user);
    }

    public async getAccessToken(refreshToken: RefreshTokenDto): Promise<TokenResponse> {
        return await this.authRepository.regenerateToken(refreshToken);
    }
}