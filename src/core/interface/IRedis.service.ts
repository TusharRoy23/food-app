export interface IRedisService {
    saveData({ key, value, exp }: { key: string, value: any, exp: number }): Promise<boolean>;
    getData({ key }: { key: string }): Promise<any>;
}