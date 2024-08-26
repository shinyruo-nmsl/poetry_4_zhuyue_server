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
      },
      {
        freezeTableName: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      }
    );
  }
}
