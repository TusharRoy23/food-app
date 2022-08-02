import { Restaurent } from "../../modules/restaurent/entity/restaurent.entity";

export interface IRestaurentSharedRepo {
    restaurentInfo(uuid: string): Promise<Restaurent>;
}