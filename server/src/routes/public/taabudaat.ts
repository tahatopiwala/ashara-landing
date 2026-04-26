import { Router } from 'express';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, Tables } from '../../db/dynamo.js';
import type { CityTaabudaat } from '../../../../shared/types.js';

const router = Router();

router.get('/cities/:slug/taabudaat', async (req, res) => {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: Tables.TAABUDAAT,
        Key: { citySlug: req.params.slug },
      })
    );

    if (!result.Item) {
      res.status(404).json({ error: 'Taabudaat data not found' });
      return;
    }

    res.json({ taabudaat: result.Item as CityTaabudaat });
  } catch (error) {
    console.error('Error fetching taabudaat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
