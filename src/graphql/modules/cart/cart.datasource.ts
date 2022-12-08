import { RequestOptions, RESTDataSource } from "apollo-datasource-rest";
import { CartReponse } from "../../../shared/utils/response.utils";

export class CartDataSource extends RESTDataSource {
    constructor(
    ) {
        super();
        this.baseURL = process.env.DOMAIN_URL;
    }

    protected willSendRequest(request: RequestOptions): void | Promise<void> {
        request.headers.set('authorization', this.context.access_token);
    }

    async createCart(restaurentUuid: string, cartObj: Object): Promise<CartReponse> {
        return await this.post(`cart/restaurent/${encodeURIComponent(restaurentUuid)}`, cartObj);
    }

    async updateCart(cartUuid: string, cartObj: Object): Promise<CartReponse> {
        return await this.post(`cart/${encodeURIComponent(cartUuid)}`, cartObj);
    }

    async deleteCart(cartUuid: string, itemUuid: string): Promise<CartReponse> {
        return await this.delete(`cart/${encodeURIComponent(cartUuid)}/${encodeURIComponent(itemUuid)}`);
    }

    async getCart(cartUuid: string): Promise<CartReponse> {
        return await this.get(`cart/${encodeURIComponent(cartUuid)}`);
    }
}