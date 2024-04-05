import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import getDbConnection from "../service/dbConnection";

export interface PoetryModelFields
  extends Model<
    InferAttributes<PoetryModelFields>,
    InferCreationAttributes<PoetryModelFields>
  > {
  id: CreationOptional<number>;
  title: string;
  author: string;
  content: string;
}

export default function getPoetryModel() {
  const poetryModel = getDbConnection().define<PoetryModelFields>(
    "shici",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
      },
      author: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.STRING(4000),
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return poetryModel;
}
