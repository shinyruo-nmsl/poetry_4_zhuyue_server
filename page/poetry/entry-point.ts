import { Request, Response, NextFunction } from "express";
import {
  queryPoetriesByAuthorAndKeyWords,
  AuthorAndKeyWordsQuery,
} from "./data-access";
import { RouteConfig } from "../../service/middlewareHandler";

const getPoetriesByAuthorAndKeyWordsRoute: RouteConfig = {
  method: "get",
  path: "/getPoetriesByAuthorAndKeyWords",
  middlewareConfig: {
    option: {},
    async customHandle(
      req: Request & {
        query: AuthorAndKeyWordsQuery & { limit: string; pageNo: string };
      },
      res: Response,
      next: NextFunction
    ) {
      try {
        const [limit, pageNo] = [
          Number(req.query.limit),
          Number(req.query.pageNo),
        ];

        if (isNaN(limit) || isNaN(pageNo)) {
          res.status(400).send({ msg: "参数错误" });
          return;
        }
        const data = await queryPoetriesByAuthorAndKeyWords({
          ...req.query,
          limit,
          pageNo,
        });
        res.send(data);
      } catch (err) {
        next(err);
      }
    },
  },
};

export default [getPoetriesByAuthorAndKeyWordsRoute];
