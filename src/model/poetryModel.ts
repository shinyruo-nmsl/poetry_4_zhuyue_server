import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { PoemsDataBase } from "./db";

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

export default class PoetryModel {
  static get transcation() {
    return PoemsDataBase.transcation;
  }

  static get model() {
    return PoemsDataBase.connection.define<PoetryModelFields>(
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
        indexes: [
          {
            type: "FULLTEXT",
            fields: [ "content"],
          }
        ]
      }
    );
  }
}
