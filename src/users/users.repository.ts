import { User, UserResponse } from "../utils/user.type.ts";
import { Statuses, UserOperations } from "../utils/api.enum.ts";
import { Message, respond } from "../utils/cluster-communication.ts";
import { v4 as uuidv4 } from 'uuid';
import { Worker } from "node:cluster";

export const handleUserRequest = (users: User[], msg: Message, worker?: Worker) => {
  const { type, id, user, transactionId } = msg;
    let response: UserResponse;

    switch (type) {
      case UserOperations.GET_ALL:
        response = { status: Statuses.OK, data: users };
        break;
      
      case UserOperations.GET_ONE:
        const found = users.find(u => u.id === id);
        response = found
          ? { status: Statuses.OK, data: found }
          : { status: Statuses.NOT_FOUND, data: undefined };
        break;
      
      case UserOperations.CREATE:
        const newUser = { id: uuidv4(), ...user };
        users.push(newUser);
        response = { status: Statuses.CREATED, data: newUser };
        break;
      
      case UserOperations.UPDATE:
        const userId = users.findIndex(u => u.id === id);
        if (userId === -1) {
          response = { status: Statuses.NOT_FOUND, data: undefined };
        } else {
          users[userId] = { ...user, id };
          response = { status: Statuses.OK, data: users[userId] };
        }
        break;
      
      case UserOperations.DELETE:
        const delIdx = users.findIndex(u => u.id === id);
        if (delIdx === -1) {
          response = { status: Statuses.NOT_FOUND, data: undefined };
        } else {
          users.splice(delIdx, 1);
          response = { status: Statuses.NO_CONTENT, data: undefined };
        }
        break;
      
      default:
        response = { status: Statuses.INTERNAL_ERROR, data: undefined };
    }

    if (worker) {
      respond(worker, transactionId, response);
    } else {
      return response;
    }
};
