import { RouterConfig } from "../../service/middlewareService";
import routes from "./entry-point";

const admin: RouterConfig = {
  path: "/admin",
  routes,
};

export default admin;
