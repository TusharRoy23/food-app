import { inject, injectable } from "inversify";
import moment from "moment";
import { OrderDiscount } from "../../modules/order/entity/order-discount.entity";
import { IDatabaseService } from "../../core/interface/IDatabase.service";
import { TYPES } from "../../core/type.core";
import { Restaurent } from "../../modules/restaurent/entity/restaurent.entity";
import { NotFoundException, throwException } from "../errors/all.exception";
import { IRestaurentSharedRepo } from "../interfaces/IRestaurentShared.repository";
import { CurrentStatus } from "../utils/enum";

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
            if (restaurent && Object.keys(restaurent).length) {
                return restaurent as Restaurent;
            }
            throw new NotFoundException('Restaurent not found');
        } catch (error: any) {
            return throwException(error);
        }
    }

    async restaurentOrderDiscount(uuid: string): Promise<OrderDiscount> {
        try {
            const repo = await this.database.getRepository(OrderDiscount);
            return await repo.createQueryBuilder('order_discount')
                .innerJoinAndSelect('order_discount.restaurent', 'restaurent')
                .where('restaurent.uuid = :uuid', { uuid: uuid })
                .andWhere('order_discount.start_date <= :start_date', { start_date: moment().format('YYYY-MM-DD HH:mm:ss') })
                .andWhere('order_discount.end_date >= :end_date', { end_date: moment().format('YYYY-MM-DD HH:mm:ss') })
                .getOne();
        } catch (error: any) {
            return throwException(error);
        }
    }

}