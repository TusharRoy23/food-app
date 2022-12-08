import 'reflect-metadata';
import apolloTestServer from '../../../test-utils/apollo-test.server';
import { CREATE_ORDER, ERROR_CREATE_ORDER, ORDER_LIST } from './order-source';

describe("Order GraphQL Test", () => {
    it("Get Valid Order List", async () => {
        const result = await apolloTestServer.executeOperation({
            query: ORDER_LIST
        });

        expect(result.data?.orders).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    uuid: expect.any(String)
                })
            ])
        );
    });

    it("Create a Order", async () => {
        const result = await apolloTestServer.executeOperation({
            query: CREATE_ORDER,
            variables: {
                input: {
                    cart_uuid: "e1f3275e-a3f2-4a2d-ac3c-6eb52148fb6b"
                }
            }
        });

        expect(result.data?.createOrder).toHaveProperty('uuid');
    });

    it("Error on a Order", async () => {
        const result = await apolloTestServer.executeOperation({
            query: ERROR_CREATE_ORDER,
            variables: {
                input: {
                    cart_uuid: "e1f3275e-a3f2-4a2d-ac3c-6eb52148fb6b"
                }
            }
        });

        expect(result.errors && result.errors[0]).toHaveProperty('message');
    });
});