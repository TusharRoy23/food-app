import { Schema, Model, model } from 'mongoose';
import { IUser } from '../interface/auth.interface';

const schema = new Schema<IUser>({
    username: {
        type: String, required: true,
    },
    password: {
        type: String, required: true,
    },
    role: {
        type: String, required: true,
    },
    salt: {
        type: String,
    },
    hashRefreshToken: {
        type: String
    }
});

export const UserSchema: Model<IUser> = model('User', schema);