import { RegisterDto } from "../dto/index.dto";
import { Restaurent } from "../entity/restaurent.entity";

export interface IRestaurentRepository {
    register(registerDto: RegisterDto): Promise<string>;
    list(): Promise<Restaurent[]>;
}