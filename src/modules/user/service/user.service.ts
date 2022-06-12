import { inject, injectable } from "inversify";
import { TYPES } from "../../../core/type.core";
import { IUserRepository } from "../interfaces/IUser.repository";
import { IUserService } from "../interfaces/IUser.service";
import { User } from "../entity/user.entity";

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository
    ) {}

    async getUser(uuid: string): Promise<User> {
        return await this.userRepository.getByUuid(uuid);     
    }
    
}