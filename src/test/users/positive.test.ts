import { afterAll, describe, expect, test } from '@jest/globals';
process.env.PORT = '6000';
import { server } from '../../server.ts';
import request from 'supertest';
import { Statuses, Routes } from '../../utils/api.enum.ts';
import { User } from '../../utils/user.type.ts';
import { UPDATED_USER_DATA, USER_DATA } from './helpers.ts';

describe('Users positive tests', () => {
  let userId: string;
 
  test('should get empty array of users', async () => {
    const res = await request(server).get(Routes.users)

    expect(res.status).toBe(Statuses.OK);
    expect(res.body).toStrictEqual([]);
  });

  test('should create a user', async () => {
    const res = await request(server).post(Routes.users).send(USER_DATA);
    expect(res.status).toBe(Statuses.CREATED);
    const { id, ...rest } = res.body;
    userId = id;
    expect(rest).toStrictEqual(USER_DATA);
  });

  test('should get a user', async () => {
    const res = await request(server).get(`${Routes.users}${userId}`);

    expect(res.status).toBe(Statuses.OK);
    const { id, ...rest } = res.body as User;
    expect(rest).toStrictEqual(USER_DATA);
  });

  test('should update a user', async() => {
    const res = await request(server)
      .put(`${Routes.users}${userId}`)
      .send(UPDATED_USER_DATA);

    expect(res.status).toBe(Statuses.OK);
    const { id, ...rest } = res.body as User;
    expect(rest).toEqual(UPDATED_USER_DATA);
  });

  test('should get updated user', async () => {
    const res = await request(server).get(`${Routes.users}${userId}`);

    expect(res.status).toBe(Statuses.OK);
    const { id, ...rest } = res.body as User;
    expect(rest).toStrictEqual(UPDATED_USER_DATA);
  });
  
  test('should delete a user', async () => {
    const res = await request(server).delete(`${Routes.users}${userId}`);

    expect(res.status).toBe(Statuses.NO_CONTENT);
  });

  test('should receive not found for deleted user', async () => {
    const res = await request(server).get(`${Routes.users}${userId}`);

    expect(res.status).toBe(Statuses.NOT_FOUND);
  });
  
  afterAll((done) => {
    server.close();
    done();
  });
})
