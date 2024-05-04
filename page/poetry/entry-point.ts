import { Request, Response, NextFunction } from "express";
import {
  queryPoetriesByAuthorAndKeyWords,
  AuthorAndKeyWordsQuery,
} from "./data-access";
import { RouteConfig } from "../../service/middlewareHandler";
import { CustomError } from "../../service/errorHandler";

type GetPoetriesByAuthorAndKeyWordsReq = Request & {
  query: AuthorAndKeyWordsQuery & { limit: string; pageNo: string };
};

const getPoetriesByAuthorAndKeyWordsRoute: RouteConfig = {
  method: "get",
  path: "/getPoetriesByAuthorAndKeyWords",
  middlewareConfig: {
    option: {},
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
