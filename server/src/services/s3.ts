import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.S3_BUCKET || 'ashara-assets';
const PRESIGN_EXPIRY = 600; // 10 minutes

export function buildImageUrl(key: string): string {
  if (!key) return '';
  const region = process.env.AWS_REGION || 'us-east-1';
  return `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;
}

export async function generatePresignedUploadUrl(
  citySlug: string,
  entityType: string,
  entityId: string,
  fileName: string,
  contentType: string
): Promise<{ uploadUrl: string; key: string }> {
  const uniqueFileName = `${uuidv4()}-${fileName}`;
  const key = `${citySlug}/${entityType}/${entityId}/${uniqueFileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: PRESIGN_EXPIRY,
  });

  return { uploadUrl, key };
}
