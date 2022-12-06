export default {
    Query: {
        cartInfo: async (_source: any, args: any, context: any) => {
            const value = await context.dataSources.cartDataSource.getCart(args.uuid);
            return value.result;
        },
    },
    Mutation: {
        createCart: async (_source: any, args: any, context: any) => {
            const restaurentUuid = args.input.restaurent_uuid;
            delete args.input.restaurent_uuid;
            const value = await context.dataSources.cartDataSource.createCart(restaurentUuid, args.input);
            return value.result;
        },
        updateCart: async (_source: any, args: any, context: any) => {
            const cartUuid = args.input.cart_uuid;
            delete args.input.restaurent_uuid;
            const value = await context.dataSources.cartDataSource.updateCart(cartUuid, args.input);
            return value.result;
        },
        deleteCart: async (_source: any, args: any, context: any) => {
            const value = await context.dataSources.cartDataSource.deleteCart(args.input.cart_uuid, args.input.item_uuid);
            return value.result;
        },
    }
}