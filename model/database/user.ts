import getDbConnection from "../../service/dbConnectionService";

const getUserDatabase = getDbConnection("user");

export default getUserDatabase;
