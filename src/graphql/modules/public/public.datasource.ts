import { RequestOptions, RESTDataSource } from "apollo-datasource-rest";
import { Restaurent } from "../../../modules/restaurent/entity/index.entity";

export class PublicDataSource extends RESTDataSource {
    constructor(
    ) {
        super();
        this.baseURL = process.env.DOMAIN_URL;
    }

    async resolveURL(request: RequestOptions) {
        return super.resolveURL(request);
    }

    async getRestaurentList(): Promise<Restaurent[]> {
        return await this.get(`public/restaurent/list`);
    }
}