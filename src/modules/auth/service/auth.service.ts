import { injectable } from 'tsyringe';

@injectable()
export default class AuthService {
    async userRegistration(
        payload: any
    ) {
        console.log('payload: ', payload);
        return payload;
    }
}