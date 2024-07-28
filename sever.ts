import { Server } from "http";
import express from "express";
import dotenvFlow from "dotenv-flow";

import routers from "@/page";
import handleMiddleware from "@/service/middlewareService";
import RedisServer from "@/service/redisService";
import Logger from "@/service/logService";

let connection: Server;

export async function startWebServer() {
  dotenvFlow.config();
  Logger.init();
  RedisServer.connect();

  const app = express();
  handleMiddleware(app, routers);

  const apiAddress = await openConnection(app);
  return apiAddress;
}

export async function stopWebServer() {
  return new Promise<void>((resolve) => {
    if (connection !== undefined) {
      connection.close(() => {
        resolve();
      });
    }
  });
}

function openConnection(app: express.Application) {
  return new Promise(
    (resolve: (val: ReturnType<typeof connection.address>) => void) => {
      const port = 3333 || 0;
      connection = app.listen(port, () => {
        console.log(connection.address());
        resolve(connection.address());
      });
    }
  );
}
