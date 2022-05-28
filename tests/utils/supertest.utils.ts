import 'reflect-metadata';
import supertest, { SuperTest, Test } from 'supertest';
import { server } from '../../src/server';

export const agent: SuperTest<Test> = supertest(server.build());