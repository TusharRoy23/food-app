import { injectable } from "inversify";
import { ApiResponse, Client, RequestParams } from "@elastic/elasticsearch";
import { InternalServerErrorException } from "../errors/all.exception";
import { IElasticsearchService } from "../interfaces/IElasticsearch.service";

@injectable()
export class ElasticSearchService implements IElasticsearchService {
    private client: Client;
    constructor() {
        this.client = new Client({
            node: process.env.ELASTICSEARCH_NODE,
            auth: {
                username: process.env.ELASTICSEARCH_USERNAME || 'foodapp',
                password: process.env.ELASTICSEARCH_PASSWORD || 'foodapp'
            }
        });
    }

    async indexing({ index, body }: { index: string, body: any }): Promise<string> {
        try {
            const doc: RequestParams.Index = {
                index: index,
                body: body,
                refresh: true,
            };
            await this.client.index(doc);
            return `${index} indexing successful`;
        } catch (error) {
            throw new InternalServerErrorException('Elasticsearch Error');
        }
    }

    async update({ index, body, queryObj }: { index: string, body: any, queryObj: any }): Promise<string> {
        try {
            const data = Object.entries(body).reduce((result, [key, value]) => {
                const sourceValue = typeof value == 'string' ? `"${value}"` : value;
                return `${result} ctx._source['${key}']=${sourceValue};`
            }, '');
            const doc: RequestParams.UpdateByQuery = {
                index: index,
                refresh: true,
                body: {
                    script: {
                        source: data
                    },
                    query: {
                        match: queryObj
                    },
                }
            };
            await this.client.updateByQuery(doc);
            return `${index} index successfully updated`;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async search({ index, queryObj }: { index: string, queryObj: any }): Promise<any[]> {
        try {
            const params: RequestParams.Search = {
                index: index,
                body: {
                    query: queryObj
                }
            };
            const { body }: ApiResponse = await this.client.search(params);
            return body.hits.hits.map((item: any) => item._source);
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}