import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { IAuthRepository } from '../interfaces/IAuth.repository';
import { IAuthService } from '../interfaces/IAuth.service';
import { User } from '../../user/entity/user.entity';
import { SignInCredentialsDto, SignUpCredentialsDto } from '../dto/index.dto';

@injectable()
export class AuthService implements IAuthService {
    constructor(
        @inject(TYPES.IAuthRepository) private authRepository: IAuthRepository
    ) {}

    async signIn(payload: SignInCredentialsDto): Promise<User> {
        return await this.authRepository.signIn(payload);
    }

    public async createUser(user: SignUpCredentialsDto): Promise<string> {
        return await this.authRepository.add(user);
    }
}