import { inject, injectable } from "inversify";
import { TYPES } from "../../../core/type.core";
import { RegisterDto } from "../dto/register.dto";
import { Restaurent } from "../entity/restaurent.entity";
import { IRestaurentRepository } from "../interfaces/IRestaurent.repository";
import { IRestaurentService } from "../interfaces/IRestaurent.service";

@injectable()
export class RestaurentService implements IRestaurentService {
    constructor(
        @inject(TYPES.IRestaurentRepository) private restaurentRepo: IRestaurentRepository
    ) { }

    async list(): Promise<Restaurent[]> {
        return await this.restaurentRepo.list();
    }

    async register(registerDto: RegisterDto): Promise<string> {
        return await this.restaurentRepo.register(registerDto);
    }
}