/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import express from 'express';
import cors from 'cors';
import { WorkstationsClient } from '@google-cloud/workstations';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins }));

app.use(express.json());

/**
 * Helper to create a user-scoped WorkstationsClient using an OAuth access token.
 */
const getUserScopedClient = async (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const err = new Error('Unauthorized: Missing bearer token');
    err.status = 401;
    throw err;
  }

  const authClient = new OAuth2Client();

  try {
    await authClient.getTokenInfo(token);
  } catch (e) {
    console.error('Invalid token:', e.message);
    const err = new Error('Unauthorized: Invalid token');
    err.status = 401;
    throw err;
  }

  authClient.setCredentials({ access_token: token });

  return new WorkstationsClient({ authClient });
};

/**
 * Helper middleware to handle asynchronous Express routes and standard errors.
 * It wraps the async route handler and catches any rejected promises, passing them to the next error handling middleware.
 *
 * @param {Function} fn - The asynchronous route handler function.
 * @returns {Function} Express middleware function.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * GET /api/workstations/all
 * Retrieves all workstations across all locations, clusters, and configurations for a specific Google Cloud Project.
 */
app.get(
  '/api/workstations/all',
  asyncHandler(async (req, res) => {
    const { projectId } = req.query;
    if (!projectId || !/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(projectId)) {
      return res.status(400).json({ error: 'Missing or invalid projectId' });
    }

    const parent = `projects/${projectId}/locations/-/workstationClusters/-/workstationConfigs/-`;
    const client = await getUserScopedClient(req);
    const [workstations] = await client.listWorkstations({ parent });
    res.json(workstations);
  })
);

/**
 * POST /api/workstations/start
 * Starts a specific Google Cloud Workstation.
 */
app.post(
  '/api/workstations/start',
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name || !name.startsWith('projects/'))
      return res.status(400).json({ error: 'Missing or invalid workstation name' });
    const client = await getUserScopedClient(req);
    const [operation] = await client.startWorkstation({ name });
    res.json({ message: 'Started', operation: operation.name });
  })
);

/**
 * POST /api/workstations/stop
 * Stops a specific Google Cloud Workstation.
 */
app.post(
  '/api/workstations/stop',
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name || !name.startsWith('projects/'))
      return res.status(400).json({ error: 'Missing or invalid workstation name' });
    const client = await getUserScopedClient(req);
    const [operation] = await client.stopWorkstation({ name });
    res.json({ message: 'Stopped', operation: operation.name });
  })
);

/**
 * POST /api/workstations/delete
 * Deletes a specific Google Cloud Workstation.
 */
app.post(
  '/api/workstations/delete',
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name || !name.startsWith('projects/'))
      return res.status(400).json({ error: 'Missing or invalid workstation name' });
    const client = await getUserScopedClient(req);
    const [operation] = await client.deleteWorkstation({ name });
    await operation.promise();
    res.json({ success: true });
  })
);

/**
 * GET /healthz
 * Service health check endpoint.
 */
app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));

/**
 * Global Express error handling middleware.
 */
app.use((err, req, res, _next) => {
  console.error('API Error:', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

export default app;
