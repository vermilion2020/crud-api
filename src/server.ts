import http from 'node:http';
import { App } from './app.ts';
import { LoadBalancer } from './load-balancer.ts';
import cluster from 'node:cluster';
import { User } from './utils/user.type.ts';
import { handleUserRequest } from './users/users.repository.ts';
import { DEFAULT_PORT } from './utils/consts.ts';
import 'dotenv/config';

const PORT = process.env.PORT || DEFAULT_PORT;
const MODE = process.env.MODE_CLUSTER || 'SINGLE';
const currentPort = cluster.isPrimary ? PORT : process.env.secondaryPort;

if (cluster.isPrimary) {
  let users: User[] = [];

  cluster.on('message', (worker, msg) => {
    return handleUserRequest(users,  msg, worker);
  });
}

export const server = http.createServer(cluster.isPrimary && MODE === 'CLUSTER' ? LoadBalancer() : App()).listen(currentPort, () => {
  console.log(`${cluster.isPrimary ? 'Primary' : 'Secondary'} Process ${process.pid} is running on port ${currentPort}`);
});