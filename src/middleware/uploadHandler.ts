import { MulterOptions, MulterServer } from "@/service/fileService";

export default function (config: MulterOptions & { fileField: string }) {
  return MulterServer.upload(config).single(config.fileField);
}
