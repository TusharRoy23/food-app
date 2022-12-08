import express, { Express } from "express";
import request, { SuperTestGraphQL, Variables } from 'supertest-graphql';
import apolloTestServer from "./apollo-test.server";

const app: Express = express();
const startTestServer = async () => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    await apolloTestServer.start();
    apolloTestServer.applyMiddleware({ app, path: '/graphql' });
}
startTestServer();

export const graphQlAgents: SuperTestGraphQL<unknown, Variables> = request(app);