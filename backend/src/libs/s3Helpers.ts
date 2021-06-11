import { UPLOADS_BUCKET_NAME } from '../resources/S3Bucket';

export function getS3UrlFromKey(key: string) {
  if (!key) return undefined;
  return `https://${UPLOADS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
