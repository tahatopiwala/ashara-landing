import { Router } from 'express';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, Tables } from '../../db/dynamo.js';
import type { EventConfig } from '../../../../shared/types.js';

const router = Router();

router.get('/config', async (_req, res) => {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: Tables.CONFIG,
        Key: { pk: 'EVENT' },
      })
    );

    if (!result.Item) {
      res.status(404).json({ error: 'Event config not found' });
      return;
    }

    const { pk, ...event } = result.Item;
    res.json({ event: event as EventConfig });
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
