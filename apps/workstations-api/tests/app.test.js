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
vi.mock('@google-cloud/workstations', () => {
    class WorkstationsClient {
        listWorkstations = vi.fn().mockResolvedValue([
            [{ name: 'projects/test-project/locations/us-central1/workstationClusters/cluster-1/workstationConfigs/config-1/workstations/ws-1' }]
        ]);
        startWorkstation = vi.fn().mockResolvedValue([{ name: 'operation-start-123' }]);
        stopWorkstation = vi.fn().mockResolvedValue([{ name: 'operation-stop-456' }]);
        deleteWorkstation = vi.fn().mockResolvedValue([{ 
            name: 'operation-delete-789',
            promise: () => Promise.resolve() 
        }]);
    }
    return { WorkstationsClient };
});

vi.mock('google-auth-library', () => {
    class OAuth2Client {
        getTokenInfo = vi.fn().mockResolvedValue({});
        setCredentials = vi.fn();
    }
    return { OAuth2Client };
});

describe('API Endpoints', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /healthz', () => {
        it('should return 200 OK', async () => {
            const res = await request(app).get('/healthz');
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ status: 'ok' });
        });
    });

    describe('GET /api/workstations/all', () => {
        it('should return 401 if no token provided', async () => {
            const res = await request(app).get('/api/workstations/all?projectId=test-project');
            expect(res.status).toBe(401);
            expect(res.body.error).toContain('Missing bearer token');
        });

        it('should return 400 if projectId is missing', async () => {
            const res = await request(app)
                .get('/api/workstations/all')
                .set('Authorization', 'Bearer mock-token');
            expect(res.status).toBe(400);
            expect(res.body.error).toContain('Missing or invalid projectId');
        });

        it('should return 200 and workstations list', async () => {
            const res = await request(app)
                .get('/api/workstations/all?projectId=test-project')
                .set('Authorization', 'Bearer mock-token');
            
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0].name).toContain('ws-1');
        });
    });

    describe('POST /api/workstations/start', () => {
        it('should start a workstation', async () => {
            const res = await request(app)
                .post('/api/workstations/start')
                .set('Authorization', 'Bearer mock-token')
                .send({ name: 'projects/test/locations/us-central1/workstations/ws-1' });
            
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Started');
            expect(res.body.operation).toBe('operation-start-123');
        });

        it('should return 400 for invalid name', async () => {
            const res = await request(app)
                .post('/api/workstations/start')
                .set('Authorization', 'Bearer mock-token')
                .send({ name: 'invalid-name' });
            
            expect(res.status).toBe(400);
        });
    });
});
