import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  ...(process.env.DYNAMO_ENDPOINT && {
    endpoint: process.env.DYNAMO_ENDPOINT,
  }),
});

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

// Table names
export const Tables = {
  CONFIG: process.env.TABLE_CONFIG || 'ashara-config',
  CITIES: process.env.TABLE_CITIES || 'ashara-cities',
  ZONES: process.env.TABLE_ZONES || 'ashara-zones',
  TRANSPORTATION: process.env.TABLE_TRANSPORTATION || 'ashara-transportation',
  NEWS: process.env.TABLE_NEWS || 'ashara-news',
  TAABUDAAT: process.env.TABLE_TAABUDAAT || 'ashara-taabudaat',
} as const;
