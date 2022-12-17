import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Resource, Database } from '@adminjs/typeorm';
import { User, UserInfo } from '../user/entity/index.entity';
import appDataSource from '../../datasource.config';
import { Restaurent, RestaurentItem, RestaurentRating } from '../restaurent/entity/index.entity';
import { Item } from '../item/entity/item.entity';
import { Cart, CartItem } from '../cart/entity/index.entity';
import { Order, OrderDiscount, OrderItem } from '../order/entity/index.entity';

const DEFAULT_ADMIN = {
    email: 'admin@gm.com',
    password: '12345',
}

const authenticate = async (email: string, password: string) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN)
    }
    return null
}

export const adminServerinit = async (app: any) => {
    await appDataSource.initialize();
    AdminJS.registerAdapter({ Resource, Database });

    const adminOptions = {
        resources: [
            User,
            UserInfo,
            Restaurent,
            RestaurentItem,
            RestaurentRating,
            {
                resource: Item,
                options: {
                    properties: {
                        price: {
                            type: 'number',
                        }
                    }
                }
            },
            Cart,
            CartItem,
            Order,
            OrderDiscount,
            OrderItem,
        ]
    };

    const admin = new AdminJS(adminOptions);

    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'sessionsecret',
        },
        null,
        {
            name: 'adminjs',
        }
    );

    app.use(admin.options.rootPath, adminRouter);
    if (process.env.NODE_ENV === 'dev') {
        admin.watch();
    }
};


// const adminOptions = {
//     resources: [UserInfo]
// };

// export const admin = new AdminJS(adminOptions);

// export const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
//     admin,
//     {
//         authenticate,
//         cookieName: 'adminjs',
//         cookiePassword: 'sessionsecret',
//     },
//     null,
//     {
//         name: 'adminjs',
//     }
// );