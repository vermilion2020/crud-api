import { IncomingMessage, ServerResponse } from "node:http";
import { Statuses, Routes, UserOperations } from "../utils/api.enum.ts";
import { getBody, getId } from "../utils/handle-data.ts";
import { validateBody, validateId } from "./user.validation.ts";
import { sendRequest } from "../utils/cluster-communication.ts";

export const getUsers = async (_: IncomingMessage, res: ServerResponse) => {
  const response = await sendRequest(UserOperations.GET_ALL);
  return res.writeHead(Statuses.OK).end(JSON.stringify(response.data));
}

export const getUser = async (req: IncomingMessage, res: ServerResponse) => {
  const id = getId(req, Routes.users);
  const error = validateId(id);

  if (error) {
    return res.writeHead(Statuses.BAD_REQUEST).end(JSON.stringify({ error }));
  }

  const response = await sendRequest(UserOperations.GET_ONE, { id });
  if (response.status === Statuses.NOT_FOUND) {
    return res.writeHead(Statuses.NOT_FOUND).end(JSON.stringify({ error: `User with id ${id} not found` }));
  }

  return res.writeHead(response.status).end(JSON.stringify(response.data));
}

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  const body = await getBody(req);

  const { errors, user } = validateBody(body);
  if (!!errors.length) {
    return res.writeHead(Statuses.BAD_REQUEST).end(JSON.stringify({ error: errors }));
  }

  if (user) {
    const response = await sendRequest(UserOperations.CREATE, { user });
    return res.writeHead(response.status).end(JSON.stringify(response.data));
  }
}

export const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
  const id = getId(req, Routes.users);
  const idError = validateId(id);

  if (idError) {
    return res.writeHead(Statuses.BAD_REQUEST).end(JSON.stringify({ error: idError }));
  }

  const body = await getBody(req);

  const { errors, user } = validateBody(body);
  if (!!errors.length) {
    return res.writeHead(Statuses.BAD_REQUEST).end(JSON.stringify({ error: errors }));
  }

  if (user) {
    const response = await sendRequest(UserOperations.UPDATE, { id, user });

    if (response.status === Statuses.NOT_FOUND) {
      return res.writeHead(Statuses.NOT_FOUND).end(JSON.stringify({ error: `User with id ${id} not found` }));
    }
    return res.writeHead(response.status).end(JSON.stringify(response.data));
  }
}

export const deleteUser = async (req: IncomingMessage, res: ServerResponse) => {
  const id = getId(req, Routes.users);
  const idError = validateId(id);

  if (idError) {
    return res.writeHead(Statuses.BAD_REQUEST).end(JSON.stringify({ error: idError }));
  }
  
  const response = await sendRequest(UserOperations.DELETE, { id });

  if (response.status === Statuses.NOT_FOUND) {
    return res.writeHead(Statuses.NOT_FOUND).end(JSON.stringify({ error: `User with id ${id} not found` }));
  }
  return res.writeHead(response.status).end(JSON.stringify(response.data));
}
