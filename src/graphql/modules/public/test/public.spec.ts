import 'reflect-metadata';
import apolloTestServer from '../../../test-utils/apollo-test.server';
import { GET_RESTAURENTS } from "./public-source";

describe("Public GraphQL Test", () => {
    it("Get List of Restaurent", async () => {
        const result = await apolloTestServer.executeOperation({
            query: GET_RESTAURENTS
        });

        expect(result.data?.restaurents).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    name: expect.any(String)
                })
            ])
        );
    });
});