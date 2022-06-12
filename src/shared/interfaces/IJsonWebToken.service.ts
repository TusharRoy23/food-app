export interface IJsonWebTokenService {
    encode (payload: Object, isAccessToken: boolean): Promise<string>;
    decode (token: string, isAccessToken: boolean): Promise<any>;
}