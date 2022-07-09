import { RegisterDto } from "../dto/index.dto";
import { Restaurent } from "../entity/restaurent.entity";

export interface IRestaurentService {
    register(registerDto: RegisterDto): Promise<string>;
    list(): Promise<Restaurent[]>;
}