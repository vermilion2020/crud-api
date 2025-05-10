import { v4 as uuidv4 } from 'uuid';
import { Worker } from 'cluster';
import { User, UserDTO, UserResponse } from "./user.type.ts";
import { UserOperations } from './api.enum.ts';
import { handleUserRequest } from '../users/users.repository.ts';

export type Message = {
  type: UserOperations,
  id?: string,
  user?: User | UserDTO,
  transactionId?: string,
  response?: UserResponse,
}

type Payload = {
  id?: string,
  user?: UserDTO,
}

const users: User[] = [];

export const respond = (worker: Worker, transactionId: string, response: UserResponse) => {
  worker.send({ transactionId, response });
};

export const sendRequest = async (type: UserOperations, payload: Payload = {}): Promise<UserResponse> => {
  if (process.env.MODE_CLUSTER === 'CLUSTER') {
  return new Promise((resolve) => {
    const transactionId = uuidv4();
    const handler = (msg: Message) => {
      if (msg.transactionId === transactionId) {
        process.off('message', handler);
        resolve(msg.response);
      }
    };
    process.on('message', handler);
    process.send?.({ type, ...payload, transactionId });
  });
  } else {
    return handleUserRequest(users, { type, ...payload }, undefined) as UserResponse;
  }
}
