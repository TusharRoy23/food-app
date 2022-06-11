import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { User } from '../../user/entity/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { IAuthRepository } from '../interfaces/IAuth.repository';
import { SignInCredentialsDto, SignUpCredentialsDto } from '../dto/index.dto';
import { NotFoundException, InternalServerErrorException, BadRequestException } from '../../../shared/errors/all.exception';
import { IDatabaseService } from "../../../core/interface/IDatabase.service";
import { UserInfo } from '../../user/entity/user-info.entity';

@injectable()
export class AuthRepository implements IAuthRepository {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService
    ) {}

    async signIn(payload: SignInCredentialsDto): Promise<User> {
        try {
            const repo = await this.database.getRepository(User);
            const user = await repo.findOneBy({ email: payload.email }) as User;
            const isPasswordMatched = await user.validatePassword(payload.password, user.password);

            if (Object.keys(user).length && isPasswordMatched) {
                return user as User;
            }
            throw new NotFoundException('User not found');
        } catch (error: any) {
            if (error instanceof NotFoundException) throw new NotFoundException('User not found');
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    async add(payload: SignUpCredentialsDto): Promise<string> {
        try {
            const repo = await this.database.getRepository(User);
            const user = new User();
            user.email = payload.email;
            user.uuid = uuidv4();
            user.password = await user.doPasswordhashing(payload.password);

            const userInfoRepo = await this.database.getRepository(UserInfo);
            const userInfo = new UserInfo();
            userInfo.uuid = uuidv4();

            user.user_info = await userInfoRepo.save(userInfo);
            const createdUser: User = repo.create(user);
            await repo.save(createdUser);

            return 'User successfully created !';
        } catch (error: any) {
            if (error.code == 23505) throw new BadRequestException('Email Already Exists!');
            throw new InternalServerErrorException(`${error.message}`);
        }
    }
}