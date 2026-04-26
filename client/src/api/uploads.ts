import { apiFetch } from './client';
import type { PresignRequest, PresignResponse } from '../../../shared/types';

export function getPresignedUrl(data: PresignRequest) {
  return apiFetch<PresignResponse>('/admin/uploads/presign', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function uploadToS3(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  if (!res.ok) {
    throw new Error('Failed to upload file to S3');
  }
}
