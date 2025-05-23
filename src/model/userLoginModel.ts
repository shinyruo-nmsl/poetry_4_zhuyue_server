import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import { Platform, Role } from "@/global-type/user";

import { UserDatabase } from "./_db";

export interface UserLoginModelFields
  extends Model<
    InferAttributes<UserLoginModelFields>,
    InferCreationAttributes<UserLoginModelFields>
  > {
  user_id: string;
  account: string;
  user_name: string | null;
  password: string;
  avatar: string | null;
  role: Role;
  platform: Platform;
}

export default class UserLoginModel {
  static get transcation() {
    return UserDatabase.transcation;
  }

  static get model() {
    return UserDatabase.connection.define<UserLoginModelFields>(
      "user_login",
      {
        user_id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        account: {
          type: DataTypes.STRING,
        },
        user_name: {
          type: DataTypes.STRING,
          defaultValue: null,
        },
        password: {
          type: DataTypes.STRING,
        },
        role: {
          type: DataTypes.STRING,
          defaultValue: "ordinary",
        },
        avatar: {
          type: DataTypes.STRING,
          defaultValue: null,
        },
        platform: {
          type: DataTypes.STRING,
          defaultValue: "pc",
        },
      },
      {
        freezeTableName: true,
        timestamps: false,
      }
    );
  }
}
