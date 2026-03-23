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
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new WorkstationsClient();

// Helper to handle API requests and standard errors
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// 1. List All Workstations across regions/clusters/configs for a Project
app.get('/api/workstations/all', asyncHandler(async (req, res) => {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ error: 'Missing projectId' });
    
    // Use wildcards to fetch across all locations, clusters, and configs in one shot!
    const parent = `projects/${projectId}/locations/-/workstationClusters/-/workstationConfigs/-`;
    
    // Some GCP APIs paginate. Since we want all, auto-pagination is handled by the Node SDK if we omit maxResults
    const [workstations] = await client.listWorkstations({ parent });
    res.json(workstations);
}));

// We can keep the Start and Stop endpoints exactly as they are since they use the full resource name of the workstation, which the frontend extracts.

// 4. Start Workstation
app.post('/api/workstations/start', asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing workstation name' });
    const [operation] = await client.startWorkstation({ name });
    res.json({ message: 'Started', operation: operation.name });
}));

// 5. Stop Workstation
app.post('/api/workstations/stop', asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing workstation name' });
    const [operation] = await client.stopWorkstation({ name });
    res.json({ message: 'Stopped', operation: operation.name });
}));

// Error handler
app.use((err, req, res, _next) => {
    console.error('API Error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
