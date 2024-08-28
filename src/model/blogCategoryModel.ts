import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import { BlogDatabase } from "./_db";

export interface BlogCategoryModelFields
  extends Model<
    InferAttributes<BlogCategoryModelFields>,
    InferCreationAttributes<BlogCategoryModelFields>
  > {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default class BlogCategoryModel {
  static get transcation() {
    return BlogDatabase.transcation;
  }

  static get model() {
    return BlogDatabase.connection.define<BlogCategoryModelFields>(
      "blog_category",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
        },
        createdAt: {
          type: DataTypes.DATE,
          field: "created_at",
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: "updated_at",
        },
      },
      {
        freezeTableName: true,
        timestamps: true,
      }
    );
  }
}
