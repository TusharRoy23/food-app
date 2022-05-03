export interface IUser {
    username: string,
    password: string,
    role: string,
    salt: string,
    hashRefreshToken: string
}