import { Router } from 'express';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, Tables } from '../../db/dynamo.js';
import type { NewsItem } from '../../../../shared/types.js';

const router = Router();

router.get('/cities/:slug/news', async (req, res) => {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: Tables.NEWS,
        KeyConditionExpression: 'citySlug = :slug',
        ExpressionAttributeValues: { ':slug': req.params.slug },
        ScanIndexForward: false, // newest first
      })
    );

    const news = (result.Items || []).map((item) => {
      const { sk, ...rest } = item as NewsItem & { sk: string };
      return rest;
    });

    res.json({ news });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/cities/:slug/news/:id', async (req, res) => {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: Tables.NEWS,
        KeyConditionExpression: 'citySlug = :slug',
        FilterExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':slug': req.params.slug,
          ':id': req.params.id,
        },
      })
    );

    const items = result.Items || [];
    if (items.length === 0) {
      res.status(404).json({ error: 'News item not found' });
      return;
    }

    res.json({ newsItem: items[0] as NewsItem });
  } catch (error) {
    console.error('Error fetching news item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
