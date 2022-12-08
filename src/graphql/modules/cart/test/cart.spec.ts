import 'reflect-metadata';
import apolloTestServer from '../../../test-utils/apollo-test.server';
import { CREATE_CART, DELETE_CART, GET_CART_INFO, UPDATE_CART } from "./cart-source";

describe("Cart GraphQL Test", () => {
    it("Create a Cart", async () => {
        const result = await apolloTestServer.executeOperation({
            query: CREATE_CART,
            variables: {
                input: {
                    uuid: "10d9d7e5-8b89-438c-bd75-7f0381cf03fb",
                    qty: 3,
                    restaurent_uuid: "59ae9336-435c-47eb-b5d9-4f0669af74c7"
                }
            }
        });

        expect(result.data?.createCart).toHaveProperty('uuid');
    });

    it("Update a Cart", async () => {
        const result = await apolloTestServer.executeOperation({
            query: UPDATE_CART,
            variables: {
                input: {
                    uuid: "8bd66bcf-be3d-4b58-8828-68d14ac1e22b",
                    qty: 1,
                    cart_uuid: "59ae9336-435c-47eb-b5d9-4f0669af74c7"
                }
            }
        });

        expect(result.data?.updateCart).toHaveProperty('uuid');
    });

    it("Delete a Cart", async () => {
        const result = await apolloTestServer.executeOperation({
            query: DELETE_CART,
            variables: {
                input: {
                    item_uuid: "8bd66bcf-be3d-4b58-8828-68d14ac1e22b",
                    cart_uuid: "59ae9336-435c-47eb-b5d9-4f0669af74c7"
                }
            }
        });

        expect(result.data?.deleteCart).toHaveProperty('uuid');
    });

    it("Get a Cart", async () => {
        const result = await apolloTestServer.executeOperation({
            query: GET_CART_INFO,
            variables: {
                input: {
                    uuid: "59ae9336-435c-47eb-b5d9-4f0669af74c7"
                }
            }
        });

        expect(result.data?.cartInfo).toHaveProperty('uuid');
    });
});