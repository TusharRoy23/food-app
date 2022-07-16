import { inject, injectable } from "inversify";
import { TYPES } from "../../../core/type.core";
import { IDatabaseService } from "../../../core/interface/IDatabase.service";
import { Cart } from "../entity/cart.entity";
import { ICartRepository } from "../interfaces/ICart.repository";

@injectable()
export class CartRepository implements ICartRepository {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService
    ) { }
    create(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    retrive(): Promise<Cart> {
        throw new Error("Method not implemented.");
    }
    update(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    delete(): Promise<string> {
        throw new Error("Method not implemented.");
    }

}