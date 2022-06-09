import { User } from "../entity/user.entity";

export interface IUserService {
    getUser(userId: number): Promise<User>;
}