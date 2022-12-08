import { injectable } from "inversify";
import { agent } from "../../../../tests/utils/supertest.utils";
import container from "../../../core/container.core";
import { TYPES } from "../../../core/type.core";
import { Restaurent } from "../../../modules/restaurent/entity/restaurent.entity";
import { fakeItem, fakeItemList, fakeRestaurent } from "../../../../tests/utils/fake.service";
import { CreateItemDto } from "../dto/create-item.dto";
import { UpdateItemDto } from "../dto/update-item.dto";
import { Item } from "../entity/item.entity";
import { IItemService } from "../interfaces/IItem.service";

@injectable()
export class FakeItemService implements IItemService {
    create(payload: CreateItemDto, restaurent: Restaurent): Promise<string> {
        return Promise.resolve('Item successfully created');
    }
    retrive(restaurentUuid: string): Promise<Item[]> {
        return Promise.resolve(fakeItemList);
    }
    update(payload: UpdateItemDto, uuid: string, restaurent: Restaurent): Promise<Item> {
        return Promise.resolve(fakeItem);
    }
    delete(uuid: string, restaurent: Restaurent): Promise<string> {
        return Promise.resolve('Successfully deleted');
    }
}

describe('Public Item Controller', () => {
    beforeAll(() => {
        container.rebind<IItemService>(TYPES.IItemService).to(FakeItemService);
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('Retrieve Restaurent Item', () => {
        it('Index', (done) => {
            agent.get(`/public/item/${fakeRestaurent.uuid}`)
                .expect(200, done)
        });
    });
});