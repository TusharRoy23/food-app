import { Request, Response } from 'express';
import { makeExecutableSchema } from "@graphql-tools/schema";
import { constraintDirective, constraintDirectiveTypeDefs, createApolloQueryValidationPlugin } from 'graphql-constraint-directive';
import { ApolloServer } from "apollo-server-express";
import { CartDataSource, OrderDataSource, PublicDataSource } from "./graphql/index.datasource";
import resolvers from "./graphql/index.resolver";
import typeDefs from "./graphql/index.schema";
import { graphQlFormatError } from './graphql-error-format';


const getHttpContext = ({ req, res }: { req: Request, res: Response }) => {
    return {
        'access_token': req.headers?.authorization || '',
    };
}

let schema = makeExecutableSchema({
    typeDefs: [constraintDirectiveTypeDefs, typeDefs],
    resolvers,
});

schema = constraintDirective()(schema);
const plugins = [
    createApolloQueryValidationPlugin({
        schema
    })
];

const apolloServer = new ApolloServer({
    schema,
    plugins,
    context: getHttpContext,
    dataSources: () => {
        return {
            orderDataSource: new OrderDataSource(),
            cartDataSource: new CartDataSource(),
            publicDataSource: new PublicDataSource(),
        };
    },
    debug: process.env.NODE_ENV === 'dev' ? true : false,
    formatError: (error: any) => graphQlFormatError(error),
});

export default apolloServer;