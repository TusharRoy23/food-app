import { User } from '../../user/entity/user.entity';
import { SignInCredentialsDto, SignUpCredentialsDto } from '../dto/index.dto';

export interface IAuthRepository {
    add(user: SignUpCredentialsDto): Promise<string>;
    signIn(payload: SignInCredentialsDto): Promise<User>;
}