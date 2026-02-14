import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { StorageInterface } from "./local.js";

export class S3Storage implements StorageInterface {
  private client: S3Client;
  private bucket: string;

  constructor(opts: {
    endpoint: string;
    region?: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
  }) {
    this.bucket = opts.bucket;
    this.client = new S3Client({
      endpoint: opts.endpoint,
      region: opts.region ?? "auto",
      credentials: {
        accessKeyId: opts.accessKeyId,
        secretAccessKey: opts.secretAccessKey,
      },
    });
  }

  async saveSoul(slug: string, version: string, content: string): Promise<string> {
    const key = `${slug}/${version}/soul.md`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: content,
        ContentType: "text/markdown",
      })
    );
    return key;
  }

  async getSoul(slug: string, version: string): Promise<string | null> {
    try {
      const res = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: `${slug}/${version}/soul.md`,
        })
      );
      return (await res.Body?.transformToString()) ?? null;
    } catch {
      return null;
    }
  }

  async deleteSoul(slug: string, version?: string): Promise<void> {
    if (version) {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: `${slug}/${version}/soul.md`,
        })
      );
    }
    // For full slug deletion, would need ListObjects — skipped for simplicity
  }
}
