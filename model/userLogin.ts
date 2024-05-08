import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

import { Role } from "../global-type/user";

import getUserDatabase from "./database/user";

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
}

export default function getUserLoginModel() {
  const userLoginModel = getUserDatabase().define<UserLoginModelFields>(
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
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return userLoginModel;
}
