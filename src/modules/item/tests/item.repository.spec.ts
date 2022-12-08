import 'reflect-metadata';
import { IDatabaseService } from "../../../core/interface/IDatabase.service";
import { fakeItem, fakeItemList, FakeRepository, fakeRestaurent } from "../../../../tests/utils/fake.service";
import { Item } from "../entity/item.entity";
import { ItemRepository } from "../repository/item.repository";
import { CreateItemDto } from '../dto/create-item.dto';
import { InternalServerErrorException } from '../../../shared/errors/all.exception';

describe("Item Repository", () => {
    const fakeRepo = new FakeRepository();
    let itemRepo: ItemRepository;

    const fakeMethods = {
        save: fakeRepo.save({}),
        update: fakeRepo.update({})
    };

    const createItemDto: CreateItemDto = {
        ...fakeItem,
        discount_rate: 0,
        discount_start_date: '',
        discount_end_date: '',
    };

    const dbService: IDatabaseService = {
        getRepository: jest.fn().mockImplementation(() => fakeMethods)
    };

    beforeEach(() => {
        itemRepo = new ItemRepository(dbService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("Repository", () => {
        it("getRepository method called", async () => {
            const spy = jest.spyOn(dbService, 'getRepository');
            dbService.getRepository(Item);
            expect(spy).toHaveBeenCalled();
        })
    });

    describe("Create a item", () => {
        it("Should call create method", async () => {
            const spy = jest.spyOn(itemRepo, 'create').mockImplementation(() => Promise.resolve('Item successfully created'));
            await itemRepo.create(createItemDto, fakeRestaurent);
            expect(spy).toHaveBeenCalled();
        });

        it("Should call create method only once", async () => {
            const spy = jest.spyOn(itemRepo, 'create').mockImplementation(() => Promise.resolve('Item successfully created'));
            await itemRepo.create(createItemDto, fakeRestaurent);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it("Successfully item Created", async () => {
            jest.spyOn(itemRepo, 'create').mockImplementation(() => Promise.resolve('Item successfully created'));
            const response = await itemRepo.create(createItemDto, fakeRestaurent);
            expect(response).toEqual('Item successfully created');
        });
    });

    describe("Item List", () => {
        it("Should call retrieve method", async () => {
            const spy = jest.spyOn(itemRepo, 'retrive').mockImplementation(() => Promise.resolve(fakeItemList));
            await itemRepo.retrive(fakeRestaurent.uuid);
            expect(spy).toHaveBeenCalled();
        });

        it("Should call retrieve method only once", async () => {
            const spy = jest.spyOn(itemRepo, 'retrive').mockImplementation(() => Promise.resolve(fakeItemList));
            await itemRepo.retrive(fakeRestaurent.uuid);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it("Successfully item retrieved", async () => {
            jest.spyOn(itemRepo, 'retrive').mockImplementation(() => Promise.resolve(fakeItemList));
            const response = await itemRepo.retrive(fakeRestaurent.uuid);
            expect(response.length).toEqual(fakeItemList.length);
        });
    });

    describe("Item Error", () => {
        it("Error on item creation", async () => {
            jest.spyOn(itemRepo, 'create').mockImplementation(() => Promise.reject(new InternalServerErrorException('Failed')));
            await expect(itemRepo.create).rejects.toThrow(new InternalServerErrorException('Failed'));
        });

        it("Error on item retrieve", async () => {
            jest.spyOn(itemRepo, 'retrive').mockImplementation(() => Promise.reject(new InternalServerErrorException('Failed')));
            await expect(itemRepo.retrive).rejects.toThrow(new InternalServerErrorException('Failed'));
        });
    });
})