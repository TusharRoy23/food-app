import { inject, injectable } from "inversify";
import { TYPES } from "../../../core/type.core";
import { IUserRepository } from "../interfaces/IUser.repository";
import { User } from "../entity/user.entity";
import { IUserService } from "../interfaces/IUser.service";

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository
    ) {}

    async getUser(uuid: string): Promise<User> {
        return await this.userRepository.getByUuid(uuid);     
    }
    
}