import { AuthenticationError, UserInputError, ValidationError } from "apollo-server-express";
import { GraphQLError } from "graphql";

export const graphQlFormatError = (error: any) => {
    const errCode = error.extensions?.code;
    const respErr: any = error.extensions?.response;

    switch (errCode) {
        case 'UNAUTHENTICATED':
            return new AuthenticationError(respErr.body.message, {
                'code': 'UNAUTHENTICATED',
            });
        case 'BAD_USER_INPUT':
            return new UserInputError(error.message, {
                'code': 'BAD_USER_INPUT',
            });
        case 'FORBIDDEN':
            return new UserInputError(respErr.body.message, {
                'code': 'FORBIDDEN',
            });
        case 'GRAPHQL_VALIDATION_FAILED':
            return new ValidationError(error.message);
        default:
            return new GraphQLError(respErr.body.message);
    }
}