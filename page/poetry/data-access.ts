import { Op } from "sequelize";
import getPoetryModel, { PoetryModelFields } from "../../model/poetry";
import { Pagination, PaginationQuery } from "../../global-type/model";

export interface AuthorAndKeyWordsQuery extends PaginationQuery {
  keyword1: string;
  keyword2: string;
  author: string;
}

export async function queryPoetriesByAuthorAndKeyWords(
  query: AuthorAndKeyWordsQuery
): Promise<Pagination<PoetryModelFields>> {
  const { limit, pageNo, keyword1, keyword2, author } = query;

  console.log(query);

  const where = {
    author,
    content: {
      [Op.or]: [
        {
          [Op.substring]: keyword1,
        },
        {
          [Op.substring]: keyword2,
        },
      ],
    },
  };

  const [data, total] = await Promise.all([
    getPoetryModel().findAll({ where, offset: limit * pageNo, limit }),
    getPoetryModel().count({ where }),
  ]);

  return {
    data,
    total,
    limit,
    pageNo,
  };
}
