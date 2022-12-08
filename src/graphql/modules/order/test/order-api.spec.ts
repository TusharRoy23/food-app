import 'reflect-metadata';
import { graphQlAgents } from '../../../test-utils/supertest-graphql.server';
import { ORDER_LIST, CREATE_ORDER } from './order-source';

describe("GraphQL - Order API Test", () => {
    it("Get Valid Order List", async () => {
        const { data }: any = await graphQlAgents
            .query(
                ORDER_LIST
            )
            .set('authorization', 'some token')
            .expectNoErrors();

        expect(data.orders).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    order_item: expect.any(Array)
                })
            ])
        );
    });

    it("Create a Order", async () => {
        const { data }: any = await graphQlAgents
            .mutate(CREATE_ORDER)
            .set('authorization', 'some token')
            .variables({
                input: {
                    cart_uuid: "e1f3275e-a3f2-4a2d-ac3c-6eb52148fb6b"
                }
            }
            ).expectNoErrors();

        expect(data.createOrder).toHaveProperty('serial_number');
    })
});