import { Sequelize } from "sequelize";

export default function getDbConnection(database: string) {
  let dbConnection: Sequelize;

  return () => {
    if (!dbConnection) {
      dbConnection = new Sequelize(
        database,
        process.env.MYSQL_USR_NAME,
        process.env.MYSQL_PASSWORD,
        {
          host: process.env.MYSQL_HOST_NAME,
          port: 3306,
          dialect: "mysql",
          benchmark: true,
          dialectOptions: {
            encrypt: true,
            ssl: {
              rejectUnauthorized: false,
            },
          },
          logQueryParameters: true,
          pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
        }
      );
      dbConnection
        .authenticate()
        .then(() =>
          console.log("Connection has been established successfully.")
        )
        .catch((error) =>
          console.error("Unable to connect to the database:", error.message)
        );
    }

    return dbConnection;
  };
}
