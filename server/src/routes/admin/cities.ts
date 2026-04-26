import { Router } from 'express';
import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, Tables } from '../../db/dynamo.js';
import type {
  CityAbout,
  CityTransportation,
  Attraction,
  Activity,
  TransportHub,
} from '../../../../shared/types.js';

const router = Router();

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

function validateAttraction(a: unknown): a is Attraction {
  if (!a || typeof a !== 'object') return false;
  const x = a as Record<string, unknown>;
  return (
    typeof x.id === 'string' &&
    typeof x.name === 'string' &&
    typeof x.distance === 'string' &&
    typeof x.description === 'string' &&
    isStringArray(x.highlights) &&
    typeof x.imageKey === 'string'
  );
}

function validateActivity(a: unknown): a is Activity {
  if (!a || typeof a !== 'object') return false;
  const x = a as Record<string, unknown>;
  return (
    typeof x.id === 'string' &&
    typeof x.title === 'string' &&
    typeof x.description === 'string' &&
    typeof x.season === 'string' &&
    typeof x.icon === 'string'
  );
}

function validateAbout(about: unknown): about is CityAbout {
  if (!about || typeof about !== 'object') return false;
  const x = about as Record<string, unknown>;
  return (
    typeof x.population === 'string' &&
    typeof x.altitude === 'string' &&
    typeof x.description === 'string' &&
    isStringArray(x.keyFacts) &&
    Array.isArray(x.attractions) &&
    x.attractions.every(validateAttraction) &&
    Array.isArray(x.activities) &&
    x.activities.every(validateActivity)
  );
}

function validateHub(h: unknown): h is TransportHub {
  if (!h || typeof h !== 'object') return false;
  const x = h as Record<string, unknown>;
  return (
    typeof x.name === 'string' &&
    typeof x.code === 'string' &&
    typeof x.address === 'string' &&
    isStringArray(x.facilities) &&
    isStringArray(x.transportOptions)
  );
}

function validateTransportation(t: unknown): t is Omit<CityTransportation, 'citySlug'> {
  if (!t || typeof t !== 'object') return false;
  const x = t as Record<string, unknown>;
  return (
    Array.isArray(x.airports) &&
    x.airports.every(validateHub) &&
    Array.isArray(x.railwayStations) &&
    x.railwayStations.every(validateHub) &&
    isStringArray(x.travelTips)
  );
}

router.put('/cities/:slug/about', async (req, res) => {
  try {
    const citySlug = req.params.slug;
    const { about } = req.body;

    if (!validateAbout(about)) {
      res.status(400).json({ error: 'Invalid about payload' });
      return;
    }

    const existing = await docClient.send(
      new GetCommand({
        TableName: Tables.CITIES,
        Key: { citySlug },
      })
    );

    if (!existing.Item) {
      res.status(404).json({ error: 'City not found' });
      return;
    }

    await docClient.send(
      new UpdateCommand({
        TableName: Tables.CITIES,
        Key: { citySlug },
        UpdateExpression: 'SET about = :about',
        ExpressionAttributeValues: { ':about': about },
      })
    );

    res.json({ about });
  } catch (error) {
    console.error('Error updating city about:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/cities/:slug/transportation', async (req, res) => {
  try {
    const citySlug = req.params.slug;
    const { transportation } = req.body;

    if (!validateTransportation(transportation)) {
      res.status(400).json({ error: 'Invalid transportation payload' });
      return;
    }

    const item: CityTransportation = { citySlug, ...transportation };

    await docClient.send(
      new PutCommand({
        TableName: Tables.TRANSPORTATION,
        Item: item,
      })
    );

    res.json({ transportation: item });
  } catch (error) {
    console.error('Error updating transportation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
