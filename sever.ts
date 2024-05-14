import { Server } from "http";
import express from "express";

import routers from "./page";
import handleMiddleware from "./service/middlewareService";
import RedisServer from "./service/redisService";

let connection: Server;

export async function startWebServer() {
  const app = express();
  app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
    );
    next();
  });
  RedisServer.connect();
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
