import { Router } from 'express';
import { generatePresignedUploadUrl } from '../../services/s3.js';
import type { PresignRequest } from '../../../../shared/types.js';

const router = Router();

router.post('/uploads/presign', async (req, res) => {
  try {
    const { citySlug, entityType, entityId, fileName, contentType } =
      req.body as PresignRequest;

    if (!citySlug || !entityType || !entityId || !fileName || !contentType) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const result = await generatePresignedUploadUrl(
      citySlug,
      entityType,
      entityId,
      fileName,
      contentType
    );

    res.json(result);
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
