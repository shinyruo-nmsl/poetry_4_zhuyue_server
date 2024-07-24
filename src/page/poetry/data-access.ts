import { Op } from "sequelize";
import PoetryModel, { PoetryModelFields } from "@/model/poetryModel";
import { Pagination, PaginationQuery } from "@/global-type/model";
import { queryPaginationRecords } from "@/service/modelService";

export interface AuthorAndKeyWordsQuery extends PaginationQuery {
  keyword1: string;
  keyword2: string;
  author?: string;
}

export async function queryPoetriesByAuthorAndKeyWords(
  query: AuthorAndKeyWordsQuery
): Promise<Pagination<PoetryModelFields>> {
  const { limit, pageNo, keyword1, keyword2, author } = query;

  // const keywords =
  //   keyword1 && keyword2 ? `${keyword1} | ${keyword2}` : keyword1 || keyword2;

  // let where = "";
  // if (author) {
  //   where = `author = '${author}' AND (content REGEXP '^.*${keyword1}[^。]*${keyword2}.*$' OR content REGEXP '^.*${keyword2}[^。]*${keyword1}.*$')`;
  // } else {
  //   where = `content REGEXP '^.*${keyword1}[^。]*${keyword2}.*$' OR content REGEXP '^.*${keyword2}[^。]*${keyword1}.*$'`;
  // }

  // const contentSql = `
  //   SELECT * FROM (
  //     SELECT * FROM shici WHERE MATCH(content) AGAINST('${keywords}' IN BOOLEAN MODE)
  //   ) AS t WHERE ${where} LIMIT ${limit} OFFSET ${limit * pageNo}
  // `;

  // const totalSql = `
  //   SELECT COUNT(*) FROM (
  //     SELECT * FROM shici WHERE MATCH(content) AGAINST('${keywords}' IN BOOLEAN MODE)
  //   ) AS t WHERE ${where}
  // `;

  // const [data] = (await PoetryModel.model.sequelize.query(contentSql)) as [
  //   PoetryModelFields[],
  //   any
  // ];

  // const [total] = (await PoetryModel.model.sequelize.query(totalSql)) as [
  //   { "COUNT(*)": number }[],
  //   any
  // ];

  // return {
  //   data,
  //   total: total[0]["COUNT(*)"],
  //   limit,
  //   pageNo,
  // };
  const content = {
    [Op.or]: [
      {
        [Op.regexp]: `^.*${keyword1}[^。]*${keyword2}.*$`,
      },
      {
        [Op.regexp]: `^.*${keyword2}[^。]*${keyword1}.*$`,
      },
    ],
  };
  const where = author
    ? {
        author,
        content,
      }
    : { content };

  return queryPaginationRecords(PoetryModel.model, where, limit, pageNo);
}
