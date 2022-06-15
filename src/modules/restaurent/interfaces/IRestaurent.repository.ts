import { RegisterDto } from "../dto/index.dto";

export interface IRestaurentRepository {
    register(registerDto: RegisterDto): Promise<string>;
}