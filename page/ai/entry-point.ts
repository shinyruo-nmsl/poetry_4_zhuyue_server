import { Response } from "express";
import { Request } from "../../global-type/request";
import { RouteConfig } from "../../service/middlewareService";
import { CustomError } from "../../service/errorService";

const gptTestRouter: RouteConfig = {
  method: "get",
  path: "/gpttest",
  middlewareConfig: {
    option: { sse: true },
    customHandle(req: Request, res: Response) {
      let count = 0;

      const intervalId = setInterval(() => {
        count++;
        if (count > 5) {
          clearInterval(intervalId);
          // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format
          res.write(
            `data:${JSON.stringify({ data: `data: \n\n`, done: true })}\n\n`
          );
          res.write(`hahah`);
        } else {
          const newData = "New SSE data";
          res.write(
            `data:${JSON.stringify({
              data: `${newData}: \n\n`,
              done: false,
            })}\n\n`
          );
        }
      }, 1000);
      req.on("close", () => {
        console.log("结束了");
        res.end();
      });
    },
  },
};

export default [gptTestRouter];
