import { Response } from "express";
import { Request } from "@/global-type/request";
import {
  queryPoetriesByAuthorAndKeyWords,
  AuthorAndKeyWordsQuery,
} from "./data-access";
import { RouteConfig } from "@/service/middlewareService";
import { CustomError } from "@/service/errorService";

type GetPoetriesByAuthorAndKeyWordsReq = Request<{
  query: AuthorAndKeyWordsQuery & { limit: string; pageNo: string };
}>;

const getPoetriesByAuthorAndKeyWordsRoute: RouteConfig = {
  method: "get",
  path: "/getPoetriesByAuthorAndKeyWords",
  middlewareConfig: {
    option: {
      auth: { role: "ordinary" },
      overtime: { timeout: 10000 },
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
