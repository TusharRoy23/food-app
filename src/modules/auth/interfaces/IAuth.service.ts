import { User } from "../../user/entity/user.entity";
import { SignInCredentialsDto, SignUpCredentialsDto } from "../dto/index.dto";

export interface IAuthService {
    signIn(payload: SignInCredentialsDto): Promise<User>;
    createUser(user: SignUpCredentialsDto): Promise<string>;
}