import { injectable } from "inversify";
import { agent } from "../../../../tests/utils/supertest.utils";
import container from "../../../core/container.core";
import { TYPES } from "../../../core/type.core";
import { Restaurent } from "../../../modules/restaurent/entity/restaurent.entity";
import { IJsonWebTokenService } from "../../../shared/interfaces/IJsonWebToken.service";
import { fakeItem, fakeItemList, fakeItemObject, fakeRestaurent, fakerOwner } from "../../../../tests/utils/fake.service";
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

const createItemDto: CreateItemDto = {
    ...fakeItemObject
};

const itemPayload = {
    ...createItemDto,
    restaurent: fakeRestaurent
};

describe('Item Controller', () => {
    let accessToken: string;
    let jsonWebTokenService: IJsonWebTokenService;

    beforeAll(() => {
        container.rebind<IItemService>(TYPES.IItemService).to(FakeItemService);
        jsonWebTokenService = container.get<IJsonWebTokenService>(TYPES.IJsonWebTokenService);
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    beforeEach(async () => {
        accessToken = await jsonWebTokenService.encode(fakerOwner, true);
    });

    describe('Create a Item', () => {
        it('Index', (done) => {
            agent.post('/item')
                .send(itemPayload)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201, done)
        });
    });

    describe('Update a Item', () => {
        it('Index', (done) => {
            agent.patch(`/item/${fakeItemObject.uuid}`)
                .send({
                    name: fakeItemObject.name,
                    price: fakeItemObject.price,
                })
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(202, done)
        });
    });
});