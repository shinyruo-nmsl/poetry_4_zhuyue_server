import { Attributes, Model, ModelCtor, WhereOptions, Op } from "sequelize";
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

export async function queryPaginationRecordsByLastID<M extends Model>(
  model: ModelCtor<M>,
  where: WhereOptions<Attributes<M>>,
  limit: number,
  key: keyof Attributes<M> & string,
  lastID?: number
) {
  try {
    const _where = lastID ? { ...where, [key]: { [Op.gt]: lastID } } : where;
    const [data, total] = await Promise.all([
      model.findAll({
        where: _where,
        order: [[key, "ASC"]],
        limit,
      }),
      model.count({ where: _where }),
    ]);

    return {
      data,
      total,
      limit,
      lastID,
    };
  } catch (error) {
    throw new CustomError(error.message, "database", error);
  }
}
