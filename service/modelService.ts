import { Attributes, Model, ModelCtor, WhereOptions } from "sequelize";
import { CustomError } from "./errorService";

export async function queryPaginationRecords<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<Attributes<M>>,
  limit: number,
  pageNo: number
) {
  try {
    const [data, total] = await Promise.all([
      model.findAll({ where, offset: limit * pageNo, limit }),
      model.count({ where }),
    ]);

    return {
      data,
      total,
      limit,
      pageNo,
    };
  } catch (error) {
    throw new CustomError(error.message, "database", error);
  }
}
