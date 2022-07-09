import { injectable, inject } from "inversify";
import { IDatabaseService } from "../../../core/interface/IDatabase.service";
import { TYPES } from "../../../core/type.core";
import { v4 as uuidv4 } from 'uuid';
import { User } from "../../../modules/user/entity/user.entity";
import { RegisterDto } from "../dto/index.dto";
import { IRestaurentRepository } from "../interfaces/IRestaurent.repository";
import { UserInfo } from "../../../modules/user/entity/user-info.entity";
import { UserRole, UserType } from "../../../shared/utils/enum";
import { Restaurent } from "../entity/restaurent.entity";
import { BadRequestException, InternalServerErrorException } from "../../../shared/errors/all.exception";

@injectable()
export class RestaurentRepository implements IRestaurentRepository {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
    ) { }

    async list(): Promise<Restaurent[]> {
        try {
            const restaurentRepo = await this.database.getRepository(Restaurent);
            return await restaurentRepo.find();
        } catch (error: any) {
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    async register(registerDto: RegisterDto): Promise<string> {
        try {
            const userRepo = await this.database.getRepository(User);
            const user = new User();
            user.email = registerDto.email;
            user.uuid = uuidv4();
            user.password = await user.doPasswordhashing(registerDto.password);
            user.user_type = UserType.RESTAURANT_USER;
            user.role = UserRole.OWNER;

            // Create User
            const createdUser = await userRepo.save(user);

            const userInfoRepo = await this.database.getRepository(UserInfo);
            const userInfo = new UserInfo();
            userInfo.uuid = uuidv4();
            userInfo.name = registerDto.name;

            // Create User Info
            const user_info = await userInfoRepo.save(userInfo);

            // create restaurent
            const restaurentRepo = await this.database.getRepository(Restaurent);
            const restaurent = new Restaurent();
            restaurent.uuid = uuidv4();
            restaurent.name = registerDto.name;
            restaurent.address = registerDto.address;
            restaurent.opening_time = registerDto.opening_time;
            restaurent.closing_time = registerDto.closing_time;

            const createdRestaurent = await restaurentRepo.save(restaurent);

            userRepo.update({ id: createdUser.id }, {
                user_info: user_info,
                restaurent: createdRestaurent
            });

            return 'Restaurent Successfully Created!';
        } catch (error: any) {
            if (error.code == 23505) throw new BadRequestException('Email Already Exists!');
            throw new InternalServerErrorException(`${error.message}`);
        }
    }
}