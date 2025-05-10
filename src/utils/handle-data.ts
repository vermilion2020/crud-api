import { IncomingMessage } from "node:http";
import { Routes } from "./api.enum.ts";

export const getId = (req: IncomingMessage, route: Routes): string => {
  const reg = new RegExp(`${route}([\\w|-]+)`, 'i');
  const match = req.url?.match(reg);
  return match && match[1] ? match[1] : '';
}
  
export const getBody = async (req: IncomingMessage): Promise<string | undefined> => {
  try {
    const body = await new Promise((resolve, reject) => {
      let body = '';

      req.on('data', (ch) => {
        body += ch;
      });

      req.on('end', () => {
        resolve(body);
      });

      req.on('error', (error) => {
        reject(error);
      });
    });

    return body as string;
  } catch (error) {
    return undefined;
  }
}