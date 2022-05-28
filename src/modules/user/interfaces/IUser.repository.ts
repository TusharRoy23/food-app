import { User } from "../entity/user.entity";

export interface IUserRepository {
    getById(userId: number): Promise<User>;
}