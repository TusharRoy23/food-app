import { injectable } from "inversify";
import { sign, verify } from "jsonwebtoken";
import { IJsonWebTokenService } from "../interfaces/IJsonWebToken.service";

@injectable()
export class JsonWebTokenService implements IJsonWebTokenService {
    private readonly JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'anyKey';
    private readonly JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || 'anyRefreshKey';

    async encode (payload: Object, isAccessToken: boolean): Promise<string> {
        return await sign(
            payload, 
            isAccessToken ? this.JWT_ACCESS_TOKEN_SECRET : this.JWT_REFRESH_TOKEN_SECRET, 
            { 
                expiresIn: isAccessToken ? (process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '90000') : 
                                            (process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || '180000')
            }
        );
    }

    async decode (token: string, isAccessToken: boolean): Promise<any> {
        return await verify(token, isAccessToken ? this.JWT_ACCESS_TOKEN_SECRET : this.JWT_REFRESH_TOKEN_SECRET);
    }
}