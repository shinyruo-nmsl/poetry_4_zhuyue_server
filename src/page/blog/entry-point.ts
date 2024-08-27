import { Response } from "express";
import { Request } from "@/global-type/request";
import { RouteConfig } from "@/service/middlewareService";
import {
  BlogArticle,
  addNewBlogCategory,
  queryBlogCategories,
  queryAllBlogArticles,
  queryBlogArticleByID,
  addNewBlogArticle,
  updateBlogArticle,
} from "./data-access";

const getBlogCategoriesRoute: RouteConfig = {
  method: "get",
  path: "/getBlogCategories",
  middlewareConfig: {
    async customHandle(req: Request, res: Response) {
      res.send(await queryBlogCategories());
    },
  },
};

const addBlogCategoryRoute: RouteConfig = {
  method: "post",
  path: "/addBlogCategory",
  middlewareConfig: {
    option: {
      auth: { role: "admin" },
    },
    async customHandle(
      req: Request<{ body: { name: string } }>,
      res: Response
    ) {
      await addNewBlogCategory(req.body.name);
      res.end();
    },
  },
};

const getBlogArticlesRoute: RouteConfig = {
  method: "get",
  path: "/getBlogArticles",
  middlewareConfig: {
    async customHandle(req: Request, res: Response) {
      res.send(await queryAllBlogArticles());
    },
  },
};

const getBlogArticleByIDRoute: RouteConfig = {
  method: "get",
  path: "/getBlogArticleByID",
  middlewareConfig: {
    async customHandle(req: Request<{ query: { id: number } }>, res: Response) {
      const data = await queryBlogArticleByID(req.query.id);
      res.send(data);
    },
  },
};

const addBlogArticleRoute: RouteConfig = {
  method: "post",
  path: "/addBlogArticle",
  middlewareConfig: {
    option: {
      auth: { role: "admin" },
    },
    async customHandle(
      req: Request<{ body: Exclude<BlogArticle, "id"> }>,
      res: Response
    ) {
      await addNewBlogArticle(req.body);
      res.end();
    },
  },
};

const updateBlogArticleRoute: RouteConfig = {
  method: "post",
  path: "/updateBlogArticle",
  middlewareConfig: {
    option: {
      auth: { role: "admin" },
    },
    async customHandle(req: Request<{ body: BlogArticle }>, res: Response) {
      await updateBlogArticle(req.body);
      res.end();
    },
  },
};

export default [
  getBlogCategoriesRoute,
  addBlogCategoryRoute,
  getBlogArticlesRoute,
  getBlogArticleByIDRoute,
  addBlogArticleRoute,
  updateBlogArticleRoute,
];
