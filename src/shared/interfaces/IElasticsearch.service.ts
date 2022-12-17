export interface IElasticsearchService {
    indexing({ index, body }: { index: string, body: any }): Promise<string>;
    update({ index, body, queryObj }: { index: string, body: any, queryObj: any }): Promise<string>;
    search({ index, queryObj }: { index: string, queryObj: any }): Promise<any[]>;
}