import { Container } from 'inversify';
import { TYPES } from './type.core';
import { DatabaseService } from './service/database.service';

/* Shared Service Import */
import { Logger } from '../shared/services/logger.service';
import { JsonWebTokenService } from '../shared/services/jsonWebToken.service';
import { IJsonWebTokenService } from '../shared/interfaces/IJsonWebToken.service';

/* All Controller Import */
import '../modules/index.controller';

/* Auth Import */
import { IAuthRepository } from '../modules/auth/interfaces/IAuth.repository';
import { AuthRepository } from '../modules/auth/repository/auth.repository';
import { IAuthService } from '../modules/auth/interfaces/IAuth.service';
import { AuthService } from '../modules/auth/service/auth.service';

/* User Import */
import { IUserRepository } from '../modules/user/interfaces/IUser.repository';
import { UserRepository } from '../modules/user/repository/user.repository';
import { IUserService } from '../modules/user/interfaces/IUser.service';
import { UserService } from '../modules/user/service/user.service';
import { IDatabaseService } from './interface/IDatabase.service';

/* Middleware Import */
import { AuthenticationMiddleware } from '../middlewares/authentication.middleware';

const container = new Container();

container.bind<IDatabaseService>(TYPES.IDatabaseService).to(DatabaseService);

/* Shared Service Bind */
container.bind(TYPES.Logger).to(Logger);
container.bind<IJsonWebTokenService>(TYPES.IJsonWebTokenService).to(JsonWebTokenService);

/* Auth Module bind */
container.bind<IAuthRepository>(TYPES.IAuthRepository).to(AuthRepository);
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService);

/* User Module bind */
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.IUserService).to(UserService);

/* Middleware bind */
container.bind<AuthenticationMiddleware>(TYPES.AuthenticationMiddleware).to(AuthenticationMiddleware);

export default container;