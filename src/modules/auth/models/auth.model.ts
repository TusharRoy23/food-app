import { UserSchema } from '../entity/auth.entity';

export class AuthModel {
    async userRegistration(data: any) {
        try {
            const value = await UserSchema.create(data);
            return value;
        } catch (error) {
            throw new Error('Error on user creation');
        }
    }
}