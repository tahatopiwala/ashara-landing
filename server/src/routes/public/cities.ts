import { Router } from 'express';
import { GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, Tables } from '../../db/dynamo.js';
import type { CityProfile } from '../../../../shared/types.js';

const router = Router();

router.get('/cities', async (_req, res) => {
  try {
    const result = await docClient.send(
      new ScanCommand({ TableName: Tables.CITIES })
    );

    const cities = (result.Items || []).map(({ citySlug: _, ...rest }) => rest) as CityProfile[];
    // Re-map: citySlug is the PK
    const mapped = (result.Items || []).map((item) => {
      const { ...city } = item;
      return city as CityProfile;
    });

    res.json({ cities: mapped });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/cities/:slug', async (req, res) => {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: Tables.CITIES,
        Key: { citySlug: req.params.slug },
      })
    );

    if (!result.Item) {
      res.status(404).json({ error: 'City not found' });
      return;
    }

    res.json({ city: result.Item as CityProfile });
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/cities/:slug/about', async (req, res) => {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: Tables.CITIES,
        Key: { citySlug: req.params.slug },
      })
    );

    if (!result.Item) {
      res.status(404).json({ error: 'City not found' });
      return;
    }

    const city = result.Item as CityProfile;
    res.json({ about: city.about });
  } catch (error) {
    console.error('Error fetching city about:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
