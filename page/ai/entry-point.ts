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
          console.log("没到这里？");
          clearInterval(intervalId);
          //   res.write(JSON.stringify({ data: `data: \n\n`, done: true }));
          res.write(`data:hahah \n\n done`);
        } else {
          const newData = "New SSE data";
          //   res.write(
          //     JSON.stringify({ data: `data: ${newData}\n\n`, done: false })
          //   );
          res.write(`data: ${newData}\n\n`);
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
