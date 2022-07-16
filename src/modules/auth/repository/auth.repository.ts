import { inject, injectable } from 'inversify';
import { TYPES } from '../../../core/type.core';
import { User } from '../../user/entity/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { IAuthRepository } from '../interfaces/IAuth.repository';
import { SignInCredentialsDto, SignUpCredentialsDto, RefreshTokenDto } from '../dto/index.dto';
import { IDatabaseService } from "../../../core/interface/IDatabase.service";
import { UserInfo } from '../../user/entity/user-info.entity';
import { IJsonWebTokenService } from '../../../shared/interfaces/IJsonWebToken.service';
import { TokenResponse, UserResponse } from '../../../shared/utils/response.utils';
import { NotFoundException, InternalServerErrorException, BadRequestException, UnauthorizedException } from '../../../shared/errors/all.exception';

@injectable()
export class AuthRepository implements IAuthRepository {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
        @inject(TYPES.IJsonWebTokenService) private readonly jsonWebTokenService: IJsonWebTokenService
    ) { }

    async signIn(payload: SignInCredentialsDto): Promise<UserResponse> {
        try {
            const user: User = await this.getUserInfo(payload.email);
            const isPasswordMatched = await user.validatePassword(payload.password, user.password);

            if (Object.keys(user).length && isPasswordMatched) {
                return {
                    user: user,
                    accessToken: await this.getAccessToken(user, true),
                    refreshToken: await this.getAccessToken(user, false)
                } as unknown as UserResponse
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

    async regenerateToken(payload: RefreshTokenDto): Promise<TokenResponse> {
        try {
            const decode = await this.jsonWebTokenService.decode(payload.token, false);
            const user: User = await this.getUserInfo(decode.email);

            return {
                accessToken: await this.getAccessToken(user, true),
                refreshToken: await this.getAccessToken(user, false)
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid Refresh Token');
        }
    }

    private async getUserInfo(email: string): Promise<User> {
        try {
            const repo = await this.database.getRepository(User);
            const user: User = await repo.findOne({ where: { email: email } });


            if (user && Object.keys(user).length) {
                return user as User;
            }
            throw new NotFoundException('User not found');
        } catch (error: any) {
            if (error instanceof NotFoundException) throw new NotFoundException('User not found');
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    private async getAccessToken(user: User, isAccessToken: boolean): Promise<string> {
        return await this.jsonWebTokenService.encode(user.toJSON(), isAccessToken);
    }
}