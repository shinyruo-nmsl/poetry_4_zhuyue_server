import { v1 } from "uuid";
import { RouteConfig } from "@/service/middlewareService";
import { Request } from "@/global-type/request";
import OSSServer from "@/service/ossService";

const uploadBase64ImgRoute: RouteConfig = {
  method: "post",
  path: "/uploadBase64Img",
  middlewareConfig: {
    option: {
      auth: { role: "ordinary" },
      upload: { fileField: "img" },
    },
    async customHandle(
      req: Request<{ body: { base64Img: string; fileName?: string } }>,
      res
    ) {
      const { base64Img, fileName = v1() } = req.body;
      const url = await OSSServer.uploadBase64Img(base64Img, fileName);
      res.send({ url }).end();
    },
  },
};

export default [uploadBase64ImgRoute];
