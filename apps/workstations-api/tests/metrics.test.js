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

import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

// Mock the GCP SDKs
vi.mock('@google-cloud/monitoring', () => {
  class MetricServiceClient {
    projectPath = vi.fn().mockImplementation((id) => `projects/${id}`);
    listTimeSeries = vi.fn().mockResolvedValue([
      [
        {
          metric: { type: 'aiplatform.googleapis.com/prediction/online/request_count' },
          points: [
            {
              interval: { startTime: { seconds: 1700000000 } },
              value: { int64Value: 42 },
            },
          ],
        },
      ],
    ]);
  }
  return { MetricServiceClient };
});

vi.mock('@google-cloud/logging', () => {
  class Logging {
    getEntries = vi.fn().mockResolvedValue([
      [
        {
          metadata: { timestamp: '2023-10-27T10:00:00Z' },
        },
      ],
    ]);
  }
  return { Logging };
});

vi.mock('google-auth-library', () => {
  class OAuth2Client {
    getTokenInfo = vi.fn().mockResolvedValue({ email: 'test@example.com' });
    setCredentials = vi.fn();
  }
  return { OAuth2Client };
});

describe('Metrics API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/metrics/project', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request(app).get('/api/metrics/project?projectId=test-project');
      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Missing bearer token');
    });

    it('should return 400 if projectId is missing', async () => {
      const res = await request(app)
        .get('/api/metrics/project')
        .set('Authorization', 'Bearer mock-token');
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Missing projectId');
    });

    it('should return 200 and project metrics data', async () => {
      const res = await request(app)
        .get('/api/metrics/project?projectId=test-project')
        .set('Authorization', 'Bearer mock-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].value).toBe(42);
      expect(res.body.data[0].time).toBe(new Date(1700000000 * 1000).toISOString());
    });
  });

  describe('GET /api/metrics/user', () => {
    it('should return 401 if no token provided', async () => {
      const res = await request(app).get('/api/metrics/user?projectId=test-project&userEmail=test@example.com');
      expect(res.status).toBe(401);
      expect(res.body.error).toContain('Missing bearer token');
    });

    it('should return 400 if projectId is missing', async () => {
      const res = await request(app)
        .get('/api/metrics/user?userEmail=test@example.com')
        .set('Authorization', 'Bearer mock-token');
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Missing projectId');
    });

    it('should return 400 if userEmail is missing', async () => {
      const res = await request(app)
        .get('/api/metrics/user?projectId=test-project')
        .set('Authorization', 'Bearer mock-token');
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Missing userEmail');
    });

    it('should return 200 and user metrics data', async () => {
      const res = await request(app)
        .get('/api/metrics/user?projectId=test-project&userEmail=test@example.com')
        .set('Authorization', 'Bearer mock-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].value).toBe(1);
      expect(res.body.data[0].time).toBe('2023-10-27T10:00:00Z');
    });
  });
});
