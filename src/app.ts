import express, { Application } from 'express';
import { api } from './shared/api';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/v1', api);

export {
    app
};