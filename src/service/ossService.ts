import OSS from "ali-oss";

import { base64ToBuffer, base64URLtoFile } from "./fileService";
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

    if (buffer.length > 1024 * 1024 * 10) {
      throw new CustomError("图片大小不能超过10M", "validate");
    }

    try {
      const result = await this.client.put(fileName + ".png", buffer);
      return result.url;
    } catch (error) {
      throw error;
    }
  }
}
