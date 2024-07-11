import { RouterConfig } from "@/service/middlewareService";
import routes from "./entry-point";

const file: RouterConfig = {
  path: "/file",
  routes,
};

export default file;
