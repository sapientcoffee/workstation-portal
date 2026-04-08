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
import { getMonitoringClient, getLoggingClient } from './auth.js';

const router = express.Router();

/**
 * Helper to handle async routes
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * GET /api/metrics/project
 * Retrieves aggregated project-wide Vertex AI metrics (e.g. request_count, token_count)
 */
router.get('/project', asyncHandler(async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) {
    return res.status(400).json({ error: 'Missing projectId' });
  }

  const client = await getMonitoringClient(req);

  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 7); // 7 days ago

  const request = {
    name: client.projectPath(projectId),
    filter: 'metric.type="aiplatform.googleapis.com/prediction/online/request_count"',
    interval: {
      startTime: {
        seconds: Math.floor(startTime.getTime() / 1000),
      },
      endTime: {
        seconds: Math.floor(Date.now() / 1000),
      },
    },
    aggregation: {
      alignmentPeriod: { seconds: 86400 }, // 1 day
      perSeriesAligner: 'ALIGN_SUM',
    },
  };

  const [timeSeries] = await client.listTimeSeries(request);

  const data = timeSeries.flatMap(ts => 
    (ts.points || []).map(p => ({
      time: new Date(p.interval.startTime.seconds * 1000).toISOString(),
      value: p.value.int64Value || p.value.doubleValue || 0,
    }))
  );

  res.json({ data });
}));

/**
 * GET /api/metrics/user
 * Retrieves user-specific usage by filtering logs based on principalEmail
 */
router.get('/user', asyncHandler(async (req, res) => {
  const { projectId, userEmail } = req.query;
  
  if (!projectId) {
    return res.status(400).json({ error: 'Missing projectId' });
  }

  if (!userEmail) {
    return res.status(400).json({ error: 'Missing userEmail' });
  }

  const logging = await getLoggingClient(req);
  logging.projectId = projectId; // Ensure correct project is targeted

  const filter = `resource.type="aiplatform.googleapis.com/Endpoint" AND protoPayload.authenticationInfo.principalEmail="${userEmail}"`;
  
  const options = {
    filter,
    pageSize: 100, // Reasonable default for a demo/dashboard
  };

  const [entries] = await logging.getEntries(options);

  // Map to flat array for recharts
  const data = entries.map(entry => ({
    time: entry.metadata.timestamp,
    value: 1 // Each log entry counts as 1 request/action
  }));

  res.json({ data });
}));

export default router;
