import { IncomingMessage, ServerResponse } from "node:http";
import { Methods, Statuses } from "./utils/api.enum.ts";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "./users/users.controller.ts";
import { USERS_URL, USER_URL } from "./utils/consts.ts";

export const App = () => {
  return async (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Content-Type', 'application/json');

    try {
      if (USER_URL.test(req.url || '') || USERS_URL.test(req.url || '')) {
        switch(req.method) {
          case Methods.GET:
            if (USER_URL.test(req.url || '')) {
              return await getUser(req, res);
            } 
            return await getUsers(req, res);

          case Methods.POST:
            return await createUser(req, res);

          case Methods.PUT:
            return await updateUser(req, res);

          case Methods.DELETE:
            return await deleteUser(req, res);

          default:
            return res.writeHead(Statuses.NOT_FOUND).end(JSON.stringify({ error: `${req.method} method is not supported on route ${req.url}` }));
        }
      }

      return res.writeHead(Statuses.NOT_FOUND).end(JSON.stringify({ error: `${req.method} method is not supported on route ${req.url}` }));
    } catch (error) {
      return res.writeHead(Statuses.INTERNAL_ERROR).end(JSON.stringify({ error: 'There was an error processing the request. Try your request again later or contact the administrator.' }));
    } 
  };
};
