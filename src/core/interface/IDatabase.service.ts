import { ObjectType, Repository } from "typeorm";

export interface IDatabaseService {
    getRepository(entity: ObjectType<any>): Promise<Repository<any>>;
}