import { inject, injectable } from 'inversify';
import { DataSource, ObjectType, Repository } from 'typeorm';
import { TYPES } from '../type.core';
import { Logger } from '../../shared/services/logger.service';
import appDataSource from '../../datasource.config';
import { IDatabaseService } from '../interface/IDatabase.service';

@injectable()
export class DatabaseService implements IDatabaseService {
    private static myDataSource: DataSource;
    constructor(
        @inject(TYPES.Logger) private readonly logger: Logger
    ) { }

    private async getConnection(): Promise<DataSource> {
        if (DatabaseService.myDataSource?.isInitialized) {
            this.logger.info('Connection Already Established!');
            return DatabaseService.myDataSource;
        }

        try {
            DatabaseService.myDataSource = await appDataSource.initialize();
            this.logger.info('Connection Established!');
        } catch (error) {
            this.logger.error(`Connection Failed. Error: ${error}`);
        }

        return DatabaseService.myDataSource;
    }

    public async getRepository(entity: ObjectType<any>): Promise<Repository<any>> {
        const connection = await this.getConnection();
        return await connection?.getRepository(entity);
    }
}