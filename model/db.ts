import DataBase from "../service/dbConnectionService";

const PoemsDataBase = new DataBase("poems");
const UserDatabase = new DataBase("user");

export { PoemsDataBase, UserDatabase };
