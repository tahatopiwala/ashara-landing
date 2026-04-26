import 'dotenv/config';
import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import type {
  CityProfile,
  CityTransportation,
  CityTaabudaat,
  Zone,
  NewsItem,
  EventConfig,
} from '../../../shared/types.js';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.DYNAMO_ENDPOINT && {
    endpoint: process.env.DYNAMO_ENDPOINT,
  }),
});

const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

const TABLE_PREFIX = '';
const Tables = {
  CONFIG: process.env.TABLE_CONFIG || 'ashara-config',
  CITIES: process.env.TABLE_CITIES || 'ashara-cities',
  ZONES: process.env.TABLE_ZONES || 'ashara-zones',
  TRANSPORTATION: process.env.TABLE_TRANSPORTATION || 'ashara-transportation',
  NEWS: process.env.TABLE_NEWS || 'ashara-news',
  TAABUDAAT: process.env.TABLE_TAABUDAAT || 'ashara-taabudaat',
};

// ===== Table creation helpers (for local DynamoDB) =====

async function tableExists(tableName: string): Promise<boolean> {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch {
    return false;
  }
}

async function createSimpleTable(
  tableName: string,
  pkName: string,
  skName?: string
) {
  if (await tableExists(tableName)) {
    console.log(`  Table ${tableName} already exists, skipping creation`);
    return;
  }

  const keySchema: { AttributeName: string; KeyType: 'HASH' | 'RANGE' }[] = [
    { AttributeName: pkName, KeyType: 'HASH' },
  ];
  const attrDefs: { AttributeName: string; AttributeType: 'S' }[] = [
    { AttributeName: pkName, AttributeType: 'S' },
  ];

  if (skName) {
    keySchema.push({ AttributeName: skName, KeyType: 'RANGE' });
    attrDefs.push({ AttributeName: skName, AttributeType: 'S' });
  }

  await client.send(
    new CreateTableCommand({
      TableName: tableName,
      KeySchema: keySchema,
      AttributeDefinitions: attrDefs,
      BillingMode: 'PAY_PER_REQUEST',
    })
  );
  console.log(`  Created table ${tableName}`);
}

// ===== Seed Data =====

const eventConfig: EventConfig & { pk: string } = {
  pk: 'EVENT',
  name: 'Ashara Mubaraka',
  year: 'Araz 1448',
  hijriYear: '1448H',
  startDate: '2026-07-15T00:00:00Z',
  endDate: '2026-07-25T00:00:00Z',
  activeCitySlug: 'nagpur',
};

const cities: CityProfile[] = [
  {
    citySlug: 'nagpur',
    name: 'Nagpur',
    tagline: 'Orange City - Heart of India',
    subtitle: 'Gateway to India\'s Finest Wildlife',
    contactEmail: 'info@asharanagpur.com',
    coordinates: { lat: 21.1458, lon: 79.0882 },
    heroImageKey: 'nagpur/city/hero.jpg',
    theme: { primaryColor: '#2d6a4f', accentColor: '#d4a373' },
    about: {
      population: '~31 Lakh',
      altitude: '310m',
      keyFacts: [
        'Zero Mile Stone - Geographic center of India',
        'Winter capital of Maharashtra',
        'GI-tagged orange production',
        'Major tiger corridor hub',
      ],
      description:
        'Nagpur is the third-largest city in Maharashtra and is known as the Orange City for its famous orange orchards. It is strategically located at the geographic center of India, marked by the Zero Mile Stone.',
      attractions: [
        {
          id: 'tadoba',
          name: 'Tadoba Tiger Reserve',
          distance: '~150 km',
          description: 'One of India\'s premier tiger reserves',
          highlights: ['Tiger safaris', 'Wildlife photography', 'Nature trails'],
          imageKey: 'nagpur/attractions/tadoba/hero.jpg',
        },
        {
          id: 'pench',
          name: 'Pench National Park',
          distance: '~75 km',
          description: 'Inspiration for Rudyard Kipling\'s Jungle Book',
          highlights: ['1,200+ species', 'Jungle Book setting', 'Bird watching'],
          imageKey: 'nagpur/attractions/pench/hero.jpg',
        },
        {
          id: 'nagzira',
          name: 'Nagzira Wildlife Sanctuary',
          distance: '~140 km',
          description: 'A biodiversity hotspot in eastern Maharashtra',
          highlights: ['Tigers', 'Leopards', 'Sloth bears'],
          imageKey: '',
        },
      ],
      activities: [
        { id: 'safari', title: 'Wildlife Safaris', description: 'Explore tiger reserves and national parks', season: 'Oct-Jun', icon: '' },
        { id: 'photo', title: 'Nature Photography', description: 'Capture diverse flora and fauna', season: 'Year-round', icon: '' },
        { id: 'agro', title: 'Agro Tourism', description: 'Visit orange orchards and farms', season: 'Nov-Feb', icon: '' },
        { id: 'shopping', title: 'Handicrafts & Shopping', description: 'Local crafts and traditional markets', season: 'Year-round', icon: '' },
        { id: 'cuisine', title: 'Local Cuisine', description: 'Saoji food and Nagpuri specialties', season: 'Year-round', icon: '' },
        { id: 'excursions', title: 'Day Excursions', description: 'Trips to Ajanta & Ellora Caves (~430 km)', season: 'Oct-Mar', icon: '' },
      ],
    },
  },
  {
    citySlug: 'mumbai',
    name: 'Mumbai',
    tagline: 'City of Dreams',
    subtitle: 'The Financial Capital of India',
    contactEmail: 'info@asharamumbai.com',
    coordinates: { lat: 19.076, lon: 72.8777 },
    heroImageKey: 'mumbai/city/hero.jpg',
    theme: { primaryColor: '#1a365d', accentColor: '#e2725b' },
    about: {
      population: '~2.1 Crore',
      altitude: '14m',
      keyFacts: [
        'Financial capital of India',
        'Home to Bollywood',
        'Gateway of India',
        'Largest city in India by population',
      ],
      description:
        'Mumbai is the capital city of Maharashtra and the financial center of India. Known for its vibrant culture, iconic landmarks, and bustling energy.',
      attractions: [
        {
          id: 'gateway',
          name: 'Gateway of India',
          distance: 'City center',
          description: 'Iconic arch monument overlooking the Arabian Sea',
          highlights: ['Historic landmark', 'Harbor views', 'Photography'],
          imageKey: '',
        },
        {
          id: 'marine-drive',
          name: 'Marine Drive',
          distance: 'City center',
          description: 'The Queen\'s Necklace - a scenic boulevard along the coast',
          highlights: ['Sunset views', 'Evening walks', 'City skyline'],
          imageKey: '',
        },
      ],
      activities: [
        { id: 'sightseeing', title: 'Sightseeing', description: 'Explore iconic landmarks and architecture', season: 'Oct-Feb', icon: '' },
        { id: 'street-food', title: 'Street Food Tours', description: 'Vada pav, pav bhaji, and more', season: 'Year-round', icon: '' },
        { id: 'shopping-m', title: 'Shopping', description: 'From street markets to luxury malls', season: 'Year-round', icon: '' },
      ],
    },
  },
  {
    citySlug: 'london',
    name: 'London',
    tagline: 'A Global City',
    subtitle: 'Where History Meets Modernity',
    contactEmail: 'info@asharalondon.com',
    coordinates: { lat: 51.5074, lon: -0.1278 },
    heroImageKey: 'london/city/hero.jpg',
    theme: { primaryColor: '#1e3a5f', accentColor: '#c8a951' },
    about: {
      population: '~9 Million',
      altitude: '11m',
      keyFacts: [
        'Capital of the United Kingdom',
        'Home to the British monarchy',
        'One of the most visited cities in the world',
        'Major global financial center',
      ],
      description:
        'London is a leading global city with strengths in arts, commerce, education, entertainment, fashion, finance, and tourism. It is one of the most diverse and cosmopolitan cities in the world.',
      attractions: [
        {
          id: 'tower',
          name: 'Tower of London',
          distance: 'City center',
          description: 'Historic castle and home of the Crown Jewels',
          highlights: ['Crown Jewels', 'Beefeater tours', '900+ years of history'],
          imageKey: '',
        },
        {
          id: 'big-ben',
          name: 'Big Ben & Parliament',
          distance: 'Westminster',
          description: 'Iconic clock tower and Houses of Parliament',
          highlights: ['Gothic architecture', 'Thames views', 'Historical significance'],
          imageKey: '',
        },
      ],
      activities: [
        { id: 'museums', title: 'Museums', description: 'World-class museums, many free of charge', season: 'Year-round', icon: '' },
        { id: 'theatre', title: 'West End Theatre', description: 'World-renowned theatrical performances', season: 'Year-round', icon: '' },
        { id: 'parks', title: 'Royal Parks', description: 'Hyde Park, Regent\'s Park, and more', season: 'Spring-Summer', icon: '' },
      ],
    },
  },
];

const nagpurZones: Zone[] = [
  {
    citySlug: 'nagpur',
    zoneId: 'zone-1',
    name: 'Zone 1 - Sadar',
    description: 'Central Nagpur area near Sadar',
    location: 'Sadar, Nagpur',
    imageKey: '',
    distanceFromAirport: '8 km',
    distanceFromStation: '3 km',
    contactPhone: '+91-9876543210',
  },
  {
    citySlug: 'nagpur',
    zoneId: 'zone-2',
    name: 'Zone 2 - Sitabuldi',
    description: 'Commercial hub of Nagpur',
    location: 'Sitabuldi, Nagpur',
    imageKey: '',
    distanceFromAirport: '10 km',
    distanceFromStation: '1 km',
    contactPhone: '+91-9876543211',
  },
  {
    citySlug: 'nagpur',
    zoneId: 'zone-3',
    name: 'Zone 3 - Dharampeth',
    description: 'Residential area with educational institutions',
    location: 'Dharampeth, Nagpur',
    imageKey: '',
    distanceFromAirport: '12 km',
    distanceFromStation: '5 km',
    contactPhone: '+91-9876543212',
  },
];

const mumbaiZones: Zone[] = [
  {
    citySlug: 'mumbai',
    zoneId: 'zone-1',
    name: 'Zone 1 - South Mumbai',
    description: 'Historic core and business district',
    location: 'Fort / Colaba, Mumbai',
    imageKey: '',
    distanceFromAirport: '30 km',
    distanceFromStation: '2 km',
    contactPhone: '+91-9876543220',
  },
  {
    citySlug: 'mumbai',
    zoneId: 'zone-2',
    name: 'Zone 2 - Bandra',
    description: 'Vibrant suburb with cultural landmarks',
    location: 'Bandra, Mumbai',
    imageKey: '',
    distanceFromAirport: '12 km',
    distanceFromStation: '15 km',
    contactPhone: '+91-9876543221',
  },
];

const londonZones: Zone[] = [
  {
    citySlug: 'london',
    zoneId: 'zone-1',
    name: 'Zone 1 - Central London',
    description: 'Westminster and the City',
    location: 'Westminster, London',
    imageKey: '',
    distanceFromAirport: '25 km (Heathrow)',
    distanceFromStation: '2 km (King\'s Cross)',
    contactPhone: '+44-2071234567',
  },
];

const transportation: CityTransportation[] = [
  {
    citySlug: 'nagpur',
    airports: [
      {
        name: 'Dr. Babasaheb Ambedkar International Airport',
        code: 'NAG',
        address: 'Airport Road, Sonegaon, Nagpur, Maharashtra 440005',
        facilities: ['24/7 Operations', 'Currency Exchange', 'Cafeteria', 'Taxi Stand', 'Car Rental'],
        transportOptions: ['Pre-paid Taxis', 'Ola', 'Uber', 'Airport Shuttle'],
      },
    ],
    railwayStations: [
      {
        name: 'Nagpur Junction Railway Station',
        code: 'NGP',
        address: 'Station Road, Nagpur, Maharashtra 440001',
        facilities: ['24/7 Access', 'Waiting Rooms', 'Food Court', 'Taxi Stand', 'Auto Rickshaws'],
        transportOptions: ['Pre-paid Taxis', 'Ola/Uber', 'Auto Rickshaws', 'Local Buses'],
      },
    ],
    travelTips: [
      'Book transport in advance for airport/station pickups',
      'Save venue addresses offline in case of connectivity issues',
      'Use ride-sharing apps (Ola/Uber) for convenient travel',
      'Consider auto rickshaws for short distances — they\'re affordable',
      'Share rides with fellow attendees to reduce costs',
      'Keep emergency contact numbers saved on your phone',
      'Plan for peak-hour traffic, especially on main roads',
    ],
  },
  {
    citySlug: 'mumbai',
    airports: [
      {
        name: 'Chhatrapati Shivaji Maharaj International Airport',
        code: 'BOM',
        address: 'Mumbai, Maharashtra 400099',
        facilities: ['24/7 Operations', 'Lounges', 'Currency Exchange', 'Duty Free'],
        transportOptions: ['Pre-paid Taxis', 'Ola', 'Uber', 'Metro', 'BEST Bus'],
      },
    ],
    railwayStations: [
      {
        name: 'Chhatrapati Shivaji Maharaj Terminus',
        code: 'CSMT',
        address: 'Fort, Mumbai, Maharashtra 400001',
        facilities: ['Heritage Building', 'Waiting Rooms', 'Food Stalls'],
        transportOptions: ['Local Trains', 'Taxis', 'BEST Bus', 'Metro'],
      },
    ],
    travelTips: [
      'Mumbai local trains are the fastest way to get around the city',
      'Avoid travel during peak hours (8-11 AM, 5-8 PM)',
      'Use the Mumbai Metro for north-south travel',
      'Keep small change handy for auto rickshaws',
      'Download offline maps — phone signal can drop in some areas',
    ],
  },
  {
    citySlug: 'london',
    airports: [
      {
        name: 'Heathrow Airport',
        code: 'LHR',
        address: 'Longford, Hounslow TW6, United Kingdom',
        facilities: ['Terminals 2-5', 'Lounges', 'Currency Exchange', 'Duty Free'],
        transportOptions: ['Heathrow Express', 'Elizabeth Line', 'Piccadilly Line', 'National Express', 'Uber'],
      },
    ],
    railwayStations: [
      {
        name: "King's Cross St Pancras",
        code: 'KGX',
        address: "Euston Road, London N1C 4QP",
        facilities: ['Eurostar Terminal', 'Underground Connection', 'Shops', 'Restaurants'],
        transportOptions: ['Underground', 'Buses', 'Taxis', 'Uber'],
      },
    ],
    travelTips: [
      'Get an Oyster card or use contactless payment for public transport',
      'The Tube (Underground) is the fastest way around central London',
      'Walking is often quicker than driving in central London',
      'Black cabs are licensed and metered — safer than unmarked cars',
      'Check TfL (Transport for London) for live service updates',
    ],
  },
];

const taabudaatMetrics = [
  { id: 'khatam', name: 'Khatam-ul-Quran', category: 'quran' as const, icon: '' },
  { id: 'tasbeeh-1', name: 'Tasbeeh of Fatema (SA)', category: 'tasbeeh' as const, icon: '' },
  { id: 'tasbeeh-2', name: 'Tasbeeh of Husain (SA)', category: 'tasbeeh' as const, icon: '' },
  { id: 'tasbeeh-3', name: 'Tasbeeh of Ali (SA)', category: 'tasbeeh' as const, icon: '' },
  { id: 'dua-joshan', name: 'Dua e Joshan', category: 'dua' as const, icon: '' },
  { id: 'dua-kamil', name: 'Dua e Kamil', category: 'dua' as const, icon: '' },
  { id: 'dua-kumail', name: 'Dua e Kumail', category: 'dua' as const, icon: '' },
  { id: 'surah-yasin', name: 'Surah Yasin', category: 'quran' as const, icon: '' },
  { id: 'ziyarat-1', name: 'Ziyarat of Imam Husain (SA)', category: 'ziyarat' as const, icon: '' },
  { id: 'ziyarat-2', name: 'Ziyarat of Imam Ali (SA)', category: 'ziyarat' as const, icon: '' },
];

const taabudaat: CityTaabudaat[] = [
  {
    citySlug: 'nagpur',
    metrics: taabudaatMetrics.map((m) => ({ ...m, count: 0 })),
  },
  {
    citySlug: 'mumbai',
    metrics: taabudaatMetrics.map((m) => ({ ...m, count: 0 })),
  },
  {
    citySlug: 'london',
    metrics: taabudaatMetrics.map((m) => ({ ...m, count: 0 })),
  },
];

const sampleNews: NewsItem[] = [
  {
    citySlug: 'nagpur',
    id: 'news-1',
    timestamp: '2026-04-20T10:00:00Z',
    title: 'Ashara Mubaraka preparations underway in Nagpur',
    content: 'The city of Nagpur is getting ready to host Ashara Mubaraka Araz 1448. Preparations are in full swing across all zones.',
    excerpt: 'Preparations are in full swing across all zones.',
    author: 'Admin',
    imageKey: '',
    pinned: true,
  },
  {
    citySlug: 'nagpur',
    id: 'news-2',
    timestamp: '2026-04-18T14:30:00Z',
    title: 'Zone assignments released',
    content: 'Zone assignments for Ashara Mubaraka have been finalized. Please check the zones page for your assigned zone.',
    excerpt: 'Zone assignments have been finalized.',
    author: 'Admin',
    imageKey: '',
    pinned: false,
  },
  {
    citySlug: 'mumbai',
    id: 'news-3',
    timestamp: '2026-04-19T09:00:00Z',
    title: 'Mumbai community meeting scheduled',
    content: 'A community meeting to discuss Ashara Mubaraka logistics has been scheduled for next week.',
    excerpt: 'Community meeting to discuss logistics.',
    author: 'Admin',
    imageKey: '',
    pinned: false,
  },
];

// ===== Seed execution =====

async function seed() {
  console.log('Creating tables...');
  await createSimpleTable(Tables.CONFIG, 'pk');
  await createSimpleTable(Tables.CITIES, 'citySlug');
  await createSimpleTable(Tables.ZONES, 'citySlug', 'zoneId');
  await createSimpleTable(Tables.TRANSPORTATION, 'citySlug');
  await createSimpleTable(Tables.NEWS, 'citySlug', 'sk');
  await createSimpleTable(Tables.TAABUDAAT, 'citySlug');

  console.log('\nSeeding event config...');
  await docClient.send(
    new PutCommand({ TableName: Tables.CONFIG, Item: eventConfig })
  );

  console.log('Seeding cities...');
  for (const city of cities) {
    await docClient.send(
      new PutCommand({ TableName: Tables.CITIES, Item: city })
    );
    console.log(`  ${city.name}`);
  }

  console.log('Seeding zones...');
  for (const zone of [...nagpurZones, ...mumbaiZones, ...londonZones]) {
    await docClient.send(
      new PutCommand({ TableName: Tables.ZONES, Item: zone })
    );
    console.log(`  ${zone.name}`);
  }

  console.log('Seeding transportation...');
  for (const t of transportation) {
    await docClient.send(
      new PutCommand({ TableName: Tables.TRANSPORTATION, Item: t })
    );
    console.log(`  ${t.citySlug}`);
  }

  console.log('Seeding taabudaat...');
  for (const t of taabudaat) {
    await docClient.send(
      new PutCommand({ TableName: Tables.TAABUDAAT, Item: t })
    );
    console.log(`  ${t.citySlug}`);
  }

  console.log('Seeding news...');
  for (const n of sampleNews) {
    await docClient.send(
      new PutCommand({
        TableName: Tables.NEWS,
        Item: { ...n, sk: `${n.timestamp}#${n.id}` },
      })
    );
    console.log(`  ${n.title}`);
  }

  console.log('\nSeed complete!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
