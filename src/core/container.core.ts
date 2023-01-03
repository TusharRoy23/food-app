import { Container } from 'inversify';
import { TYPES } from './type.core';
import { DatabaseService, IDatabaseService, IRedisService, RedisService } from './index.core';

/* Shared Service Import */
import { Logger, JsonWebTokenService, ElasticSearchService } from '../shared/services/index.service';

/* Shared Repository Import */
import { ICartSharedRepo, IUserSharedRepo, IRestaurentSharedRepo, IJsonWebTokenService, IItemSharedRepository, IOrderSharedRepository, IElasticsearchService } from '../shared/interfaces/IIndexShared.repository';
import { CartSharedRepo, UserSharedRepo, RestaurentSharedRepo, ItemSharedRepository, OrderSharedRepository } from '../shared/repositories/indexShared.repository';

/* All Controller Import */
import '../modules/index.controller';

/* Auth Import */
import { IAuthRepository, AuthRepository, IAuthService, AuthService } from '../modules/auth/auth.module';

/* User Import */
import { IUserRepository, IUserService, UserRepository, UserService } from '../modules/user/user.module';


/* Restaurent Import */
import { IRestaurentRepository, IRestaurentService, RestaurentRepository, RestaurentService } from '../modules/restaurent/restaurent.module';

/* Item Import */
import { IItemRepository, IItemService, ItemRepository, ItemService } from '../modules/item/item.module';

/* Cart Import */
import { ICartRepository, CartRepository, ICartService, CartService } from '../modules/cart/cart.module';

/* Order Import */
import { IOrderRepository, IOrderService, OrderRepository, OrderService } from '../modules/order/order.module';

/* Middleware Import */
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';

const container = new Container();

container.bind<IDatabaseService>(TYPES.IDatabaseService).to(DatabaseService);
container.bind<IRedisService>(TYPES.IRedisService).to(RedisService);

/* Shared Service Bind */
container.bind(TYPES.Logger).to(Logger);
container.bind<IJsonWebTokenService>(TYPES.IJsonWebTokenService).to(JsonWebTokenService);
container.bind<IElasticsearchService>(TYPES.IElasticsearchService).to(ElasticSearchService);

/* Shared Repository Bind */
container.bind<ICartSharedRepo>(TYPES.ICartSharedRepo).to(CartSharedRepo);
container.bind<IUserSharedRepo>(TYPES.IUserSharedRepo).to(UserSharedRepo);
container.bind<IRestaurentSharedRepo>(TYPES.IRestaurentSharedRepo).to(RestaurentSharedRepo);
container.bind<IItemSharedRepository>(TYPES.IItemSharedRepo).to(ItemSharedRepository);
container.bind<IOrderSharedRepository>(TYPES.IOrderSharedRepository).to(OrderSharedRepository);

/* Auth Module bind */
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthRepository);
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);

/* User Module bind */
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.IUserService).to(UserService);

/* Restaurent Module bind */
container.bind<IRestaurentRepository>(TYPES.IRestaurentRepository).to(RestaurentRepository);
container.bind<IRestaurentService>(TYPES.IRestaurentService).to(RestaurentService);

/* Item Module bind */
container.bind<IItemRepository>(TYPES.IItemRepository).to(ItemRepository);
container.bind<IItemService>(TYPES.IItemService).to(ItemService);

/* Cart Module bind */
container.bind<ICartRepository>(TYPES.ICartRepository).to(CartRepository);
container.bind<ICartService>(TYPES.ICartService).to(CartService);

/* Order Module bind */
container.bind<IOrderService>(TYPES.IOrderService).to(OrderService);
container.bind<IOrderRepository>(TYPES.IOrderRepository).to(OrderRepository);

/* Middleware bind */
container.bind<AuthenticationMiddleware>(TYPES.AuthenticationMiddleware).to(AuthenticationMiddleware);


export default container;