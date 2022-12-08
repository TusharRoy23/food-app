export default {
    Query: {
        restaurents: async (_source: any, args: any, context: any) => {
            const value = await context.dataSources.publicDataSource.getRestaurentList();
            return value.results;
        }
    }
}