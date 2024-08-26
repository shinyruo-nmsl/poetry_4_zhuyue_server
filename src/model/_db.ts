import DataBase from "@/service/dbConnectionService";

const PoemsDataBase = new DataBase("poems");
const UserDatabase = new DataBase("user");
const BlogDatabase = new DataBase("blog");

export { PoemsDataBase, UserDatabase, BlogDatabase };
