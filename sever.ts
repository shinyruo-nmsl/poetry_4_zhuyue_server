import { Server } from "http";
import express from "express";

import routers from "./service";
import handleMiddleware from "./util/middlewareHandler";

let connection: Server;

export async function startWebServer() {
  const app = express();
  handleMiddleware(app, routers);
  console.log("hhhhh");
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
