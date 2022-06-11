import { User } from "../entity/user.entity";

export interface IUserRepository {
    getByUuid(uuid: string): Promise<User>;
}