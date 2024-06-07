import { RouterConfig } from "@/service/middlewareService";
import routes from "./entry-point";

const user: RouterConfig = {
  path: "/user",
  routes,
};

export default user;
