import { RequestOptions, RESTDataSource } from "apollo-datasource-rest";
import { OrderResponse } from "../../../shared/utils/response.utils";

export class OrderDataSource extends RESTDataSource {
    constructor(
    ) {
        super();
        this.baseURL = process.env.DOMAIN_URL;
    }

    protected willSendRequest(request: RequestOptions): void | Promise<void> {
        request.headers.set('authorization', this.context.access_token);
    }

    async getOrdersByUser() {
        return await this.get('order/');
    }

    async createOrder(cartUuid: string): Promise<OrderResponse> {
        return await this.post('order/', { uuid: cartUuid });
    }
}