import { NextFunction, Response, Request } from "express";
import { UploadOptions, UploadServer } from "@/service/fileService";

export default function (config: {
  uploadOptions?: UploadOptions;
  fileField: string;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    UploadServer.createUploadMiddleware(config.uploadOptions).single(
      config.fileField
    )(req, res, next);
  };
}
