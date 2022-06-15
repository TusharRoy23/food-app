import { RegisterDto } from "../dto/index.dto";

export interface IRestaurentService {
    register(registerDto: RegisterDto): Promise<string>;
}