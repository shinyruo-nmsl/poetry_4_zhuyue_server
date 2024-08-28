import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import { BlogDatabase } from "./_db";

export interface BlogArticleModelFields
  extends Model<
    InferAttributes<BlogArticleModelFields>,
    InferCreationAttributes<BlogArticleModelFields>
  > {
  id: number;
  category: string;
  title: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export default class BlogArticleModel {
  static get transcation() {
    return BlogDatabase.transcation;
  }

  static get model() {
    return BlogDatabase.connection.define<BlogArticleModelFields>(
      "blog_article",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        category: {
          type: DataTypes.STRING,
        },
        title: {
          type: DataTypes.STRING,
        },
        link: {
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
