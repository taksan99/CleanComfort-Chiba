import { createHmac, createHash } from "crypto"

interface S3ClientConfig {
  region: string
  credentials: {
    accessKeyId: string
    secretAccessKey: string
  }
}

export class CustomS3Client {
  private config: S3ClientConfig

  constructor(config: S3ClientConfig) {
    this.config = config
  }

  async getSignedUrl(bucket: string, key: string, expiresIn: number): Promise<string> {
    const date = new Date()
    const dateString = date.toISOString().split("T")[0].replace(/-/g, "")

    const credential = `${this.config.credentials.accessKeyId}/${dateString}/${this.config.region}/s3/aws4_request`

    const canonicalRequest = [
      "GET",
      `/${key}`,
      `X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=${encodeURIComponent(credential)}&X-Amz-Date=${date.toISOString().replace(/[:-]|\.\d{3}/g, "")}&X-Amz-Expires=${expiresIn}&X-Amz-SignedHeaders=host`,
      `host:${bucket}.s3.${this.config.region}.amazonaws.com`,
      "",
      "host",
      "UNSIGNED-PAYLOAD",
    ].join("\n")

    const stringToSign = [
      "AWS4-HMAC-SHA256",
      date.toISOString().replace(/[:-]|\.\d{3}/g, ""),
      `${dateString}/${this.config.region}/s3/aws4_request`,
      createHash("sha256").update(canonicalRequest).digest("hex"),
    ].join("\n")

    const signature = this.getSignature(dateString, stringToSign)

    const signedUrl = `https://${bucket}.s3.${this.config.region}.amazonaws.com/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=${encodeURIComponent(credential)}&X-Amz-Date=${date.toISOString().replace(/[:-]|\.\d{3}/g, "")}&X-Amz-Expires=${expiresIn}&X-Amz-SignedHeaders=host&X-Amz-Signature=${signature}`

    return signedUrl
  }

  private getSignature(dateString: string, stringToSign: string): string {
    const kDate = createHmac("sha256", `AWS4${this.config.credentials.secretAccessKey}`).update(dateString).digest()
    const kRegion = createHmac("sha256", kDate).update(this.config.region).digest()
    const kService = createHmac("sha256", kRegion).update("s3").digest()
    const kSigning = createHmac("sha256", kService).update("aws4_request").digest()
    return createHmac("sha256", kSigning).update(stringToSign).digest("hex")
  }
}
