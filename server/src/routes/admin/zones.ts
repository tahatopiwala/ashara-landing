import { Router } from 'express';
import {
  DeleteCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { docClient, Tables } from '../../db/dynamo.js';
import type { Zone } from '../../../../shared/types.js';

const router = Router();

function validateZone(z: unknown): z is Zone {
  if (!z || typeof z !== 'object') return false;
  const x = z as Record<string, unknown>;
  return (
    typeof x.zoneId === 'string' &&
    x.zoneId.length > 0 &&
    typeof x.name === 'string' &&
    typeof x.description === 'string' &&
    typeof x.location === 'string' &&
    typeof x.imageKey === 'string' &&
    typeof x.distanceFromAirport === 'string' &&
    typeof x.distanceFromStation === 'string' &&
    typeof x.contactPhone === 'string'
  );
}

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

router.put('/cities/:slug/zones', async (req, res) => {
  try {
    const citySlug = req.params.slug;
    const { zones } = req.body;

    if (!Array.isArray(zones) || !zones.every(validateZone)) {
      res.status(400).json({ error: 'Invalid zones payload' });
      return;
    }

    const ids = new Set(zones.map((z) => z.zoneId));
    if (ids.size !== zones.length) {
      res.status(400).json({ error: 'Duplicate zoneId values' });
      return;
    }

    const existing = await docClient.send(
      new QueryCommand({
        TableName: Tables.ZONES,
        KeyConditionExpression: 'citySlug = :slug',
        ExpressionAttributeValues: { ':slug': citySlug },
        ProjectionExpression: 'zoneId',
      })
    );
    const existingIds = (existing.Items || []).map(
      (i) => i.zoneId as string
    );

    const toDelete = existingIds.filter((id) => !ids.has(id));

    for (const zoneId of toDelete) {
      await docClient.send(
        new DeleteCommand({
          TableName: Tables.ZONES,
          Key: { citySlug, zoneId },
        })
      );
    }

    for (const z of zones) {
      await docClient.send(
        new PutCommand({
          TableName: Tables.ZONES,
          Item: { ...z, citySlug },
        })
      );
    }

    res.json({ zones: zones.map((z) => ({ ...z, citySlug })) });
  } catch (error) {
    console.error('Error replacing zones:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
