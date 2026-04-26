import { Router } from 'express';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, Tables } from '../../db/dynamo.js';

const router = Router();

router.post('/cities/:slug/zones', async (req, res) => {
  try {
    const {
      zoneId,
      name,
      description,
      location,
      imageKey,
      distanceFromAirport,
      distanceFromStation,
      contactPhone,
    } = req.body;
    const citySlug = req.params.slug;

    if (!zoneId || !name) {
      res.status(400).json({ error: 'zoneId and name are required' });
      return;
    }

    const item = {
      citySlug,
      zoneId,
      name,
      description: description || '',
      location: location || '',
      imageKey: imageKey || '',
      distanceFromAirport: distanceFromAirport || '',
      distanceFromStation: distanceFromStation || '',
      contactPhone: contactPhone || '',
    };

    await docClient.send(
      new PutCommand({
        TableName: Tables.ZONES,
        Item: item,
      })
    );

    res.status(201).json({ zone: item });
  } catch (error) {
    console.error('Error creating/updating zone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
