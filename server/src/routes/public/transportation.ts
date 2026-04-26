import { Router } from 'express';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, Tables } from '../../db/dynamo.js';
import type { CityTransportation } from '../../../../shared/types.js';

const router = Router();

router.get('/cities/:slug/transportation', async (req, res) => {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: Tables.TRANSPORTATION,
        Key: { citySlug: req.params.slug },
      })
    );

    if (!result.Item) {
      res.status(404).json({ error: 'Transportation info not found' });
      return;
    }

    res.json({ transportation: result.Item as CityTransportation });
  } catch (error) {
    console.error('Error fetching transportation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
