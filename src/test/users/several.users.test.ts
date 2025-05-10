import { afterAll, describe, expect, test } from '@jest/globals';
process.env.PORT = '7000';
import { server } from '../../server.ts';
import request from 'supertest';
import { Statuses, Routes } from '../../utils/api.enum.ts';
import { User } from '../../utils/user.type.ts';
import { INCORRECT_ID, NOT_FOUND_ID, USER_DATA } from './helpers.ts';

describe('Users positive tests', () => {
  const userIds: string[] = [];

  test('should create 3 users', async () => {
    const res = await request(server).post(Routes.users).send(USER_DATA);
    expect(res.status).toBe(Statuses.CREATED);
    const { id, ...rest } = res.body;
    userIds.push(id);
    expect(rest).toStrictEqual(USER_DATA);

    const res1 = await request(server).post(Routes.users).send({ ...USER_DATA, username: `${USER_DATA.username} clone 1` });
    expect(res1.status).toBe(Statuses.CREATED);
    const { id: id1, ...rest1 } = res1.body;
    userIds.push(id1);
    expect(rest1).toStrictEqual({ ...USER_DATA, username: `${USER_DATA.username} clone 1` });

    const res2 = await request(server).post(Routes.users).send({ ...USER_DATA, username: `${USER_DATA.username} clone 2` });
    expect(res2.status).toBe(Statuses.CREATED);
    const { id: id2, ...rest2 } = res2.body;
    userIds.push(id2);
    expect(rest2).toStrictEqual({ ...USER_DATA, username: `${USER_DATA.username} clone 2` });
  });

  test('should get all users', async () => {
    const res = await request(server).get(Routes.users);
    expect(res.status).toBe(Statuses.OK);
    expect(res.body.length).toBe(userIds.length);
    expect(res.body.map((user: User) => user.id)).toStrictEqual(userIds);
  });

  test('should not delete any user if not-existing id is provided', async () => {
    const res = await request(server).delete(`${Routes.users}${NOT_FOUND_ID}`);
    expect(res.status).toBe(Statuses.NOT_FOUND);
  });

  test('should get all users', async () => {
    const res = await request(server).get(Routes.users);
    expect(res.status).toBe(Statuses.OK);
    expect(res.body.length).toBe(userIds.length);
    expect(res.body.map((user: User) => user.id)).toStrictEqual(userIds);
  });

  test('should not delete any user if incorrect id is provided', async () => {
    const res = await request(server).delete(`${Routes.users}${INCORRECT_ID}`);
    expect(res.status).toBe(Statuses.BAD_REQUEST);
  });

  test('should get all users', async () => {
    const res = await request(server).get(Routes.users);
    expect(res.status).toBe(Statuses.OK);
    expect(res.body.length).toBe(userIds.length);
    expect(res.body.map((user: User) => user.id)).toStrictEqual(userIds);
  });

  test('should delete one user if existing id is provided, other users should be remained', async () => {
    const res = await request(server).delete(`${Routes.users}${userIds[0]}`);
    expect(res.status).toBe(Statuses.NO_CONTENT);
    userIds.splice(0, 1);

    const res1 = await request(server).get(Routes.users);
    expect(res1.status).toBe(Statuses.OK);
    expect(res1.body.length).toBe(userIds.length);

    expect(res1.body.map((user: User) => user.id)).toStrictEqual(userIds);
  });

  afterAll((done) => {
    server.close();
    done();
  });
});