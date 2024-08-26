import OSS from "ali-oss";

import { base64ToBuffer } from "./fileService";
import { CustomError } from "./errorService";

export default class OSSServer {
  private static client = new OSS({
    region: process.env.ALIYUN_OSS_REGION,
    accessKeyId: process.env.ALIYUN_OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIYUN_OSS_ACCESS_KEY_SECRET,
    bucket: process.env.ALIYUN_OSS_BUCKET,
  });

  static async uploadBase64Img(base64: string, fileName: string) {
    const buffer = base64ToBuffer(base64);
    return this.uploadFileBuffer(buffer, fileName, ".png");
  }

  static async uploadFileBuffer<T extends `.${string}`>(
    buffer: Buffer,
    fileName: string,
    type: T,
    limitSize = 1024 * 1024 * 50
  ) {
    if (limitSize && buffer.byteLength > limitSize) {
      throw new CustomError(
        `文件大小不能超过${Math.floor(limitSize / (1024 * 1024))}M`,
        "validate"
      );
    }

    try {
      const result = await this.client.put(fileName + type, buffer);
      return result.url;
    } catch (error) {
      throw new CustomError("上传文件失败", "upload", error);
    }
  }
}
