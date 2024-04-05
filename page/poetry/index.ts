import { RouterConfig } from "../../service/middlewareHandler";
import routes from "./entry-point";

const poetry: RouterConfig = {
  path: "/poetry",
  routes,
};

export default poetry;
