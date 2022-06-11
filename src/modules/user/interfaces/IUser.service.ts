import { User } from "../entity/user.entity";

export interface IUserService {
    getUser(uuid: string): Promise<User>;
}