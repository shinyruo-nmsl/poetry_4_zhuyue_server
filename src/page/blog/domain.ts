import dayjs from "dayjs";
import {
  BlogArticle,
  queryBlogArticleByID,
  queryAllBlogArticles,
  queryBlogCategories,
} from "./data-access";
import { BlogArticleModelFields } from "@/model/blogArticleModel";

export async function getBlogCategories() {
  const categories = await queryBlogCategories();
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    createdAt: dayjs(category.createdAt).format("YYYY-MM-DD"),
    updatedAt: dayjs(category.updatedAt).format("YYYY-MM-DD"),
  }));
}

export async function getBlogArticles() {
  const articles = await queryAllBlogArticles();
  return articles.map(formatBlogArticle);
}

export async function getBlogArticleByID(id: number) {
  const article = await queryBlogArticleByID(id);
  return formatBlogArticle(article);
}

function formatBlogArticle(article: BlogArticleModelFields) {
  return {
    id: article.id,
    category: article.category,
    title: article.title,
    link: article.link,
    createdAt: dayjs(article.createdAt).format("YYYY-MM-DD"),
    updatedAt: dayjs(article.updatedAt).format("YYYY-MM-DD"),
  };
}
