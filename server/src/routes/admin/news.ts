import { Router } from 'express';
import {
  DeleteCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { docClient, Tables } from '../../db/dynamo.js';
import type { NewsItem } from '../../../../shared/types.js';

const router = Router();

function validateNews(n: unknown): n is NewsItem {
  if (!n || typeof n !== 'object') return false;
  const x = n as Record<string, unknown>;
  return (
    typeof x.id === 'string' &&
    x.id.length > 0 &&
    typeof x.timestamp === 'string' &&
    x.timestamp.length > 0 &&
    typeof x.title === 'string' &&
    typeof x.content === 'string' &&
    typeof x.excerpt === 'string' &&
    typeof x.author === 'string' &&
    typeof x.imageKey === 'string' &&
    typeof x.pinned === 'boolean'
  );
}

router.post('/cities/:slug/news', async (req, res) => {
  try {
    const { title, content, excerpt, author, imageKey, pinned } = req.body;
    const citySlug = req.params.slug;

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required' });
      return;
    }

    const id = uuidv4();
    const timestamp = new Date().toISOString();

    const item = {
      citySlug,
      sk: `${timestamp}#${id}`,
      id,
      timestamp,
      title,
      content,
      excerpt: excerpt || '',
      author: author || '',
      imageKey: imageKey || '',
      pinned: pinned || false,
    };

    await docClient.send(
      new PutCommand({
        TableName: Tables.NEWS,
        Item: item,
      })
    );

    res.status(201).json({ newsItem: item });
  } catch (error) {
    console.error('Error creating news item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/cities/:slug/news', async (req, res) => {
  try {
    const citySlug = req.params.slug;
    const { news } = req.body;

    if (!Array.isArray(news) || !news.every(validateNews)) {
      res.status(400).json({ error: 'Invalid news payload' });
      return;
    }

    const ids = new Set(news.map((n: NewsItem) => n.id));
    if (ids.size !== news.length) {
      res.status(400).json({ error: 'Duplicate news ids' });
      return;
    }

    const existing = await docClient.send(
      new QueryCommand({
        TableName: Tables.NEWS,
        KeyConditionExpression: 'citySlug = :slug',
        ExpressionAttributeValues: { ':slug': citySlug },
        ProjectionExpression: 'sk, id',
      })
    );

    const existingItems = (existing.Items || []).map(
      (i) => ({ sk: i.sk as string, id: i.id as string })
    );

    const newSks = new Set(
      (news as NewsItem[]).map((n) => `${n.timestamp}#${n.id}`)
    );
    const toDelete = existingItems.filter((e) => !newSks.has(e.sk));

    for (const { sk } of toDelete) {
      await docClient.send(
        new DeleteCommand({
          TableName: Tables.NEWS,
          Key: { citySlug, sk },
        })
      );
    }

    for (const n of news as NewsItem[]) {
      const sk = `${n.timestamp}#${n.id}`;
      await docClient.send(
        new PutCommand({
          TableName: Tables.NEWS,
          Item: { ...n, citySlug, sk },
        })
      );
    }

    res.json({ news });
  } catch (error) {
    console.error('Error replacing news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
