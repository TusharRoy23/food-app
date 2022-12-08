import 'reflect-metadata';
import { graphQlAgents } from '../../../test-utils/supertest-graphql.server';
import { GET_RESTAURENTS } from './public-source';


describe("GraphQL - Public API Test", () => {
    it("Get Restaurent List", async () => {
        const { data }: any = await graphQlAgents.query(
            GET_RESTAURENTS
        ).expectNoErrors();

        expect(data.restaurents).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: expect.any(String)
                })
            ])
        );
    });
})