import { Sequelize } from "sequelize";

let dbConnection: Sequelize;

export default function getDbConnection() {
  if (!dbConnection) {
    dbConnection = new Sequelize("dbName", "dbUser", "dbPassword", {
      port: 54320,
      dialect: "mysql",
      benchmark: true,
      logQueryParameters: true,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  }

  return dbConnection;
}
