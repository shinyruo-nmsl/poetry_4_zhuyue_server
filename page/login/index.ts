import { RouterConfig } from "../../service/middlewareService";
import routes from "./entry-point";

const login: RouterConfig = {
  path: "/login",
  routes,
};

export default login;
