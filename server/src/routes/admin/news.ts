import { Router } from 'express';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { docClient, Tables } from '../../db/dynamo.js';

const router = Router();

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

export default router;
