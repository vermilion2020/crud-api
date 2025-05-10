import { IncomingMessage, ServerResponse, request } from "node:http";
import os from "node:os";
import cluster from "node:cluster";
import { DEFAULT_HOST, DEFAULT_PORT } from "./utils/consts.ts";
import { Message } from "./utils/cluster-communication.ts";

export const LoadBalancer = () => {
  const ports: number[] = [];
  const createWorker = async (index: number) => {
    try {
      await new Promise((resolve) => {
        const port = DEFAULT_PORT + index + 1 ;
  
        const worker = cluster.fork({ secondaryPort: port });
    
        worker.on('message', (msg: Message) => {
          console.log(`Worker on port ${port} received message: ${msg.type}`);
        });

        worker.on('listening', () => {
          ports.push(port);
          resolve(ports);
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  os.cpus().reduce((promise, _, index) => promise.then(async () => await createWorker(index)), Promise.resolve());

  return async (incomingRequest: IncomingMessage, serverResponse: ServerResponse) => {
    try{
      await new Promise((resolve, reject) => {
        const index = Math.floor(Math.random() * ports.length);

      const resend = request({
        method: incomingRequest.method,
        hostname: process.env.HOST || DEFAULT_HOST,
        port: ports[index] || DEFAULT_PORT,
        path: incomingRequest.url,
        headers: incomingRequest.headers
      }, (response) => {
        serverResponse.setHeader('Content-Type', 'application/json');
        response.pipe(serverResponse);
      });

      serverResponse.on('error', (error) => {
        reject(error);
      });

      incomingRequest.pipe(resend);
      incomingRequest.on('end', () => {
        resolve(true);
      });
      incomingRequest.on('error', (error) => {
        reject(error);
      });
    });
    } catch (error) {
      console.error(error);
    }
  }
}
