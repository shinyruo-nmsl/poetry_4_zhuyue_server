import { Op } from "sequelize";
import PoetryModel, { PoetryModelFields } from "../../model/poetryModel";
import { Pagination, PaginationQuery } from "../../global-type/model";
import { queryPaginationRecords } from "../../service/modelService";

export interface AuthorAndKeyWordsQuery extends PaginationQuery {
  keyword1: string;
  keyword2: string;
  author?: string;
}

export async function queryPoetriesByAuthorAndKeyWords(
  query: AuthorAndKeyWordsQuery
): Promise<Pagination<PoetryModelFields>> {
  const { limit, pageNo, keyword1, keyword2, author } = query;

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
