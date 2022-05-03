import { Request, Response } from 'express';
import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';
import { app } from './app';
import { MongoService } from './shared/services/mongo.service';
// import http from 'http';

dotenv.config({ 
    path: path.join(__dirname, '..', `env/.env.${process.env.NODE_ENV}`) 
});

async function bootstrap() {
    const PORT = process.env.APP_PORT || 8000;
    // const server = http.createServer(app);

    const mongoService = new MongoService();
    await mongoService.mongoConnect();
    
    app.listen(PORT, (): void => {
        console.log(`Listening on port ${PORT}..`);
    });
}

bootstrap();