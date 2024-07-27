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
    return this.uploadImgBuffer(buffer, fileName);
  }

  static async uploadImgBuffer(buffer: Buffer, fileName: string) {
    if (buffer.length > 1024 * 1024 * 200) {
      throw new CustomError("图片大小不能超过50M", "validate");
    }

    try {
      const result = await this.client.put(fileName + ".png", buffer);
      return result.url;
    } catch (error) {
      throw new CustomError("上传图片失败", "upload", error);
    }
  }
}
