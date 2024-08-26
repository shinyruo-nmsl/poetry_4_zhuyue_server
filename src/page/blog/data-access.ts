import BlogCategoryModel from "@/model/blogCategoryModel";
import BlogArticleModel from "@/model/blogArticleModel";
import { CustomError } from "@/service/errorService";

export interface BlogArticle {
  id: number;
  category: string;
  title: string;
  link: string;
}

export async function queryBlogCategories() {
  try {
    return BlogCategoryModel.model.findAll();
  } catch (error) {
    throw new CustomError("查询博客分类失败", "database", error);
  }
}

export async function addNewBlogCategory(name: string) {
  try {
    return BlogCategoryModel.model.create({ name });
  } catch (error) {
    throw new CustomError("添加博客分类失败", "database", error);
  }
}

export async function queryAllBlogArticles() {
  try {
    return BlogArticleModel.model.findAll();
  } catch (error) {
    throw new CustomError("查询博客失败", "database", error);
  }
}

export async function queryBlogArticleByID(id: number) {
  try {
    return BlogArticleModel.model.findByPk(id);
  } catch (error) {
    throw new CustomError("查询博客失败", "database", error);
  }
}

export async function addNewBlogArticle(article: BlogArticle) {
  try {
    return BlogArticleModel.model.create(article);
  } catch (error) {
    throw new CustomError("添加博客失败", "database", error);
  }
}

export async function updateBlogArticle(article: BlogArticle) {
  try {
    return BlogArticleModel.model.update(article, {
      where: { id: article.id },
    });
  } catch (error) {
    throw new CustomError("更新博客失败", "database", error);
  }
}
