import { Response } from "express";
import { Request } from "@/global-type/request";
import { RouteConfig } from "@/service/middlewareService";
import { CustomError } from "@/service/errorService";
import {
  queryPoetriesByAuthorAndKeyWords,
  AuthorAndKeyWordsQuery,
} from "./data-access";

type GetPoetriesByAuthorAndKeyWordsReq = Request<{
  query: AuthorAndKeyWordsQuery & { limit: string; pageNo: string };
}>;

const getPoetriesByAuthorAndKeyWordsRoute: RouteConfig = {
  method: "get",
  path: "/getPoetriesByAuthorAndKeyWords",
  middlewareConfig: {
    option: {
      auth: { role: "ordinary" },
      overtime: { timeout: 20000 },
    },
    customValidate(req: GetPoetriesByAuthorAndKeyWordsReq) {
      const [limit, pageNo] = [
        Number(req.query.limit),
        Number(req.query.pageNo),
      ];

      if (isNaN(limit) || isNaN(pageNo)) {
        throw new CustomError("参数错误", "validate");
      }
    },
    async customHandle(req: GetPoetriesByAuthorAndKeyWordsReq, res: Response) {
      const [limit, pageNo] = [
        Number(req.query.limit),
        Number(req.query.pageNo),
      ];
      const data = await queryPoetriesByAuthorAndKeyWords({
        ...req.query,
        limit,
        pageNo,
      });
      res.send(data);
    },
  },
};

export default [getPoetriesByAuthorAndKeyWordsRoute];
