import { afterAll, describe, expect, test } from '@jest/globals';
process.env.PORT = '5000';
import { server } from '../../server.ts';
import request from 'supertest';

import { Statuses, Routes } from '../../utils/api.enum';
import { UPDATED_USER_DATA, USER_DATA, NOT_FOUND_ID, INCORRECT_ID, INVALID_DATA } from './helpers';
import { User } from '../../utils/user.type';

describe('Users negative tests', () => {
  let userId: string;
  test('should create a user', async () => {
    const res = await request(server).post(Routes.users).send(USER_DATA);
    expect(res.status).toBe(Statuses.CREATED);
    const { id, ...rest } = res.body;
    userId = id;
    expect(rest).toStrictEqual(USER_DATA);
  });

  test('should receive bad request for requesting user with incorrect id', async () => {
    const res = await request(server).get(`${Routes.users}${INCORRECT_ID}`);
    expect(res.status).toBe(Statuses.BAD_REQUEST);
  });

  test('should receive not found for requesting non-existing user', async () => {
    const res = await request(server).get(`${Routes.users}${NOT_FOUND_ID}`);
    expect(res.status).toBe(Statuses.NOT_FOUND);
  });

  test('should receive bad request for updating user with incorrect id', async () => {
    const res = await request(server).put(`${Routes.users}${INCORRECT_ID}`);
    expect(res.status).toBe(Statuses.BAD_REQUEST);
  });

  test('should receive not found for updating non-existing user', async() => {
    const res = await request(server)
      .put(`${Routes.users}${NOT_FOUND_ID}`)
      .send(UPDATED_USER_DATA);
    expect(res.status).toBe(Statuses.NOT_FOUND);
  });

  test('should receive bad request for deleting user with incorrect id', async () => {
    const res = await request(server).delete(`${Routes.users}${INCORRECT_ID}`);
    expect(res.status).toBe(Statuses.BAD_REQUEST);
  });

  test('should receive not found for deleting non-existing user', async() => {
    const res = await request(server)
      .delete(`${Routes.users}${NOT_FOUND_ID}`);
    expect(res.status).toBe(Statuses.NOT_FOUND);
  });

  test('should receive bad request for creating user with insufficient data', async () => {
    const insufficientUserData = { ...USER_DATA, username: undefined } as User;
    const res = await request(server)
      .post(`${Routes.users}`)
      .send(insufficientUserData);
    expect(res.status).toBe(Statuses.BAD_REQUEST);
  });

  test('should receive bad request for creating user with invalid data', async () => {
    const invalidUserData = { ...USER_DATA, username: INVALID_DATA.username };
    
    const res = await request(server)
      .post(`${Routes.users}`)
      .send(invalidUserData);
    expect(res.status).toBe(Statuses.BAD_REQUEST);
  });

  test('should receive bad request for updating user with invalid data', async () => {
    const invalidUserData = { ...USER_DATA, age: INVALID_DATA.age };
    
    const res = await request(server)
      .put(`${Routes.users}${userId}`)
      .send(invalidUserData);
    expect(res.status).toBe(Statuses.BAD_REQUEST);
  });

  afterAll((done) => {
    server.close();
    done();
  });
});
