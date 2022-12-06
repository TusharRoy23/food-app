import 'reflect-metadata';
import { graphQlAgents } from '../../../test-utils/supertest-graphql.utils';
import { CREATE_CART, UPDATE_CART, DELETE_CART, GET_CART_INFO } from "./cart-source";

describe("GraphQL - Cart API Test", () => {
    it("Create a Cart", async () => {
        const { data }: any = await graphQlAgents
            .mutate(CREATE_CART)
            .set('authorization', 'some token')
            .variables({
                input: {
                    uuid: "10d9d7e5-8b89-438c-bd75-7f0381cf03fb",
                    qty: 3,
                    restaurent_uuid: "59ae9336-435c-47eb-b5d9-4f0669af74c7"
                }
            })
            .expectNoErrors();

        expect(data.createCart).toHaveProperty('uuid');
    });

    it("Update a Cart", async () => {
        const { data }: any = await graphQlAgents
            .mutate(UPDATE_CART)
            .set('authorization', 'some token')
            .variables({
                input: {
                    uuid: "8bd66bcf-be3d-4b58-8828-68d14ac1e22b",
                    qty: 1,
                    cart_uuid: "59ae9336-435c-47eb-b5d9-4f0669af74c7"
                }
            })
            .expectNoErrors();

        expect(data.updateCart).toHaveProperty('uuid');
    });

    it("Delete a Cart", async () => {
        const { data }: any = await graphQlAgents
            .mutate(DELETE_CART)
            .set('authorization', 'some token')
            .variables({
                input: {
                    item_uuid: "8bd66bcf-be3d-4b58-8828-68d14ac1e22b",
                    cart_uuid: "59ae9336-435c-47eb-b5d9-4f0669af74c7"
                }
            })
            .expectNoErrors();

        expect(data.deleteCart).toHaveProperty('uuid');
    });

    it("Get a Cart", async () => {
        const { data }: any = await graphQlAgents
            .query(GET_CART_INFO)
            .set('authorization', 'some token')
            .variables({
                input: {
                    uuid: "59ae9336-435c-47eb-b5d9-4f0669af74c7"
                }
            })
            .expectNoErrors();

        expect(data.cartInfo).toHaveProperty('uuid');
    });
});