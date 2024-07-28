import { v1 } from "uuid";
import { RouteConfig } from "@/service/middlewareService";
import { Request } from "@/global-type/request";
import OSSServer from "@/service/ossService";
import { CustomError } from "@/service/errorService";

const uploadBase64ImgRoute: RouteConfig = {
  method: "post",
  path: "/uploadBase64Img",
  middlewareConfig: {
    option: {
      auth: { role: "ordinary" },
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

const uploadImgFileRoute: RouteConfig = {
  method: "post",
  path: "/uploadImgFile",
  middlewareConfig: {
    option: {
      auth: { role: "ordinary" },
      upload: { fileField: "file" },
    },
    async customHandle(req: Request, res) {
      const fieldName = v1();
      const buffer = req.file?.buffer;
      if (!buffer) {
        throw new CustomError("上传失败", "upload");
      }
      const url = await OSSServer.uploadImgBuffer(buffer, fieldName);
      res.send({ url }).end();
    },
  },
};

export default [uploadBase64ImgRoute, uploadImgFileRoute];
