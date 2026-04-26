import 'dotenv/config';
import express from 'express';
import { corsMiddleware } from './middleware/cors.js';
import { authMiddleware } from './middleware/auth.js';

// Public routes
import configRoutes from './routes/public/config.js';
import citiesRoutes from './routes/public/cities.js';
import zonesRoutes from './routes/public/zones.js';
import transportationRoutes from './routes/public/transportation.js';
import newsRoutes from './routes/public/news.js';
import taabudaatRoutes from './routes/public/taabudaat.js';

// Admin routes
import adminNewsRoutes from './routes/admin/news.js';
import adminZonesRoutes from './routes/admin/zones.js';
import adminUploadsRoutes from './routes/admin/uploads.js';
import adminCitiesRoutes from './routes/admin/cities.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(corsMiddleware);
app.use(express.json());

// Public API routes
app.use('/api', configRoutes);
app.use('/api', citiesRoutes);
app.use('/api', zonesRoutes);
app.use('/api', transportationRoutes);
app.use('/api', newsRoutes);
app.use('/api', taabudaatRoutes);

// Admin API routes (auth middleware placeholder applied to all)
app.use('/api/admin', authMiddleware, adminNewsRoutes);
app.use('/api/admin', authMiddleware, adminZonesRoutes);
app.use('/api/admin', authMiddleware, adminUploadsRoutes);
app.use('/api/admin', authMiddleware, adminCitiesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
