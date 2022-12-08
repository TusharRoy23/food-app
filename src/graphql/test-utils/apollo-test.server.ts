import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { constraintDirective, constraintDirectiveTypeDefs, createApolloQueryValidationPlugin } from 'graphql-constraint-directive';
import typeDefs from "../index.schema";
import {
    fakeCartData,
    fakeOrderResponse,
    fakeOrderResponseList,
    fakeRestaurentList
} from "../../../tests/utils/fake.service";
import { graphQlFormatError } from "../../graphql-error-format";

const resolvers = {
    Query: {
        orders: () => fakeOrderResponseList,
        restaurents: () => fakeRestaurentList,
        cartInfo: () => fakeCartData,
    },
    Mutation: {
        createOrder: () => fakeOrderResponse,
        createCart: () => fakeCartData,
        updateCart: () => fakeCartData,
        deleteCart: () => fakeCartData,
    },
};

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

const apolloTestServer = new ApolloServer({
    schema,
    plugins,
    mockEntireSchema: false,
    formatError: (error: any) => graphQlFormatError(error),
});

export default apolloTestServer;