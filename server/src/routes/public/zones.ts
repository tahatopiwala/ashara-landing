import { Router } from 'express';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, Tables } from '../../db/dynamo.js';
import type { Zone } from '../../../../shared/types.js';

const router = Router();

router.get('/cities/:slug/zones', async (req, res) => {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: Tables.ZONES,
        KeyConditionExpression: 'citySlug = :slug',
        ExpressionAttributeValues: { ':slug': req.params.slug },
      })
    );

    const zones = (result.Items || []) as Zone[];
    res.json({ zones });
  } catch (error) {
    console.error('Error fetching zones:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
