import { useState } from 'react';
import { getPresignedUrl, uploadToS3 } from '../api/uploads';

interface UseImageUploadOptions {
  citySlug: string;
  entityType: string;
  entityId: string;
}

export function useImageUpload({ citySlug, entityType, entityId }: UseImageUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File): Promise<string> {
    setUploading(true);
    setError(null);

    try {
      const { uploadUrl, key } = await getPresignedUrl({
        citySlug,
        entityType,
        entityId,
        fileName: file.name,
        contentType: file.type,
      });

      await uploadToS3(uploadUrl, file);
      return key;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
      throw err;
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading, error };
}
