import { RouterConfig } from "@/service/middlewareService";
import routes from "./entry-point";

const poetry: RouterConfig = {
  path: "/poetry",
  routes,
};

export default poetry;
