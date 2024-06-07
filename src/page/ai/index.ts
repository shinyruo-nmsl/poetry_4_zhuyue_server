import { RouterConfig } from "@/service/middlewareService";
import routes from "./entry-point";

const ai: RouterConfig = {
  path: "/ai",
  routes,
};

export default ai;
