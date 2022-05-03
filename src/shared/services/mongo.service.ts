import mongoose from 'mongoose';

export class MongoService {
    constructor() {
        mongoose.connection.once('open', () => {
            console.log('MongoDB connection is ready!');
        });

        mongoose.connection.on('error', (err) => {
            console.log('MongoDB connection error: ', err);
        });
    }

    async mongoConnect() {
        await mongoose.connect(`${process.env.MONGO_URL}`, {
            socketTimeoutMS: 45000,
            retryWrites: true,
            w: 'majority',
            auth: {
                username: `${process.env.MONGO_USERNAME}`,
                password: `${process.env.MONGO_PASSWORD}`,
            },
            dbName: `${process.env.MONGO_DBNAME}`
        });
    }

    async mongoDisconnect() {
        await mongoose.disconnect();
    }
}
