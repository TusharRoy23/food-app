export default {
    Query: {
        orders: async (_source: any, args: any, context: any) => {
            const value = await context.dataSources.orderDataSource.getOrdersByUser();
            return value.results;
        },
    },
    Mutation: {
        createOrder: async (_source: any, args: any, context: any) => {
            const value = await context.dataSources.orderDataSource.createOrder(args.input.cart_uuid);
            return value.results;
        }
    }
}