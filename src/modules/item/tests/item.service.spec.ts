import 'reflect-metadata';
import { fakeItem, fakeItemList, fakeRestaurent } from "../../../../tests/utils/fake.service";
import { CreateItemDto } from "../dto/create-item.dto";
import { IItemRepository } from "../interfaces/IItem.repository";
import { ItemService } from "../service/item.service";

describe('Item Service', () => {
    let itemService: ItemService;

    const itemRepo: IItemRepository = {
        create: jest.fn(() => Promise.resolve('Item successfully created')),
        retrive: jest.fn(() => Promise.resolve(fakeItemList)),
        update: jest.fn(() => Promise.resolve(fakeItem)),
        delete: jest.fn(() => Promise.resolve('Successfully deleted'))
    };

    const createItemDto: CreateItemDto = {
        ...fakeItem,
        discount_rate: 0,
        discount_start_date: '',
        discount_end_date: '',
    };

    beforeEach(() => {
        itemService = new ItemService(itemRepo);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Call Create Method', () => {
        it('Create Item Reponse', async () => {
            const response = await itemService.create(createItemDto, fakeRestaurent);
            expect(response).toEqual('Item successfully created');
        });

        it('Should create method called', async () => {
            await itemService.create(createItemDto, fakeRestaurent);
            expect(itemRepo.create).toHaveBeenCalled();
        });

        it('Should create method called only once', async () => {
            await itemService.create(createItemDto, fakeRestaurent);
            expect(itemRepo.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('Call retrive method', () => {
        it('retrive Reponse', async () => {
            jest.spyOn(itemRepo, 'retrive').mockImplementation(() => Promise.resolve(fakeItemList));
            const response = await itemService.retrive(fakeRestaurent.uuid);
            expect(response.length).toEqual(fakeItemList.length);
        });
    })
});