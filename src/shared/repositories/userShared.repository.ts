import { inject, injectable } from "inversify";
import { IDatabaseService } from "../../core/interface/IDatabase.service";
import { TYPES } from "../../core/type.core";
import { User } from "../../modules/user/entity/user.entity";
import { NotFoundException, throwException } from "../errors/all.exception";
import { IUserSharedRepo } from "../interfaces/IUserShared.repository";
import { CurrentStatus } from "../utils/enum";

@injectable()
export class UserSharedRepo implements IUserSharedRepo {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService
    ) { }

    async userInfo(userUuid: string): Promise<User> {
        try {
            const repo = await this.database.getRepository(User);
            const user: User = await repo.findOne({ where: { uuid: userUuid, current_status: CurrentStatus.ACTIVE } });

            if (Object.keys(user).length) {
                return user as User;
            }
            throw new NotFoundException('User not found');
        } catch (error: any) {
            return throwException(error);
        }
    }

}