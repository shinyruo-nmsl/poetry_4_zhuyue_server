import { RouterConfig } from "@/service/middlewareService";
import routes from "./entry-point";

const blog: RouterConfig = {
  path: "/blog",
  routes,
};

export default blog;
