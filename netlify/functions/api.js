import express from 'express';
import serverless from 'serverless-http';
import { registerRoutes } from '../../server/routes.js';
import { setupAuth } from '../../server/auth.js';

const app = express();

// Enable body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Setup authentication
setupAuth(app);

// Setup routes
await registerRoutes(app);

// Handle the /api prefix for Netlify
app.use('/.netlify/functions/api', app);

export const handler = serverless(app);