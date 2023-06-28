import { User } from "../../modules/user/entity/user.entity";

export interface IUserSharedRepo {
    userInfo(userUuid: string): Promise<User>;
}