import { inject, injectable } from "inversify";
import { IDatabaseService } from "../../core/interface/IDatabase.service";
import { TYPES } from "../../core/type.core";
import { Restaurent } from "../../modules/restaurent/entity/restaurent.entity";
import { NotFoundException, InternalServerErrorException } from "../errors/all.exception";
import { IRestaurentSharedRepo } from "../interfaces/IRestaurentShared.repository";

@injectable()
export class RestaurentSharedRepo implements IRestaurentSharedRepo {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
    ) { }

    async restaurentInfo(uuid: string): Promise<Restaurent> {
        try {
            const repo = await this.database.getRepository(Restaurent);
            // Need to check the restaurent status
            const restaurent: Restaurent = await repo.findOne({ where: { uuid: uuid } });
            if (Object.keys(restaurent).length) {
                return restaurent as Restaurent;
            }
            throw new NotFoundException('Restaurent not found');
        } catch (error: any) {
            if (error instanceof NotFoundException) throw new NotFoundException('Restaurent not found');
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

}