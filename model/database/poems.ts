import getDbConnection from "../../service/dbConnectionService";

const getPoemsDatabase = getDbConnection("poems");

export default getPoemsDatabase;
