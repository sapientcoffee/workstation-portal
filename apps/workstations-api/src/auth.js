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

import { OAuth2Client } from 'google-auth-library';
import { WorkstationsClient } from '@google-cloud/workstations';
import { MetricServiceClient } from '@google-cloud/monitoring';
import { Logging } from '@google-cloud/logging';

/**
 * Validates the bearer token and returns an OAuth2Client along with the token.
 */
export const getAuthClient = async (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const err = new Error('Unauthorized: Missing bearer token');
    err.status = 401;
    throw err;
  }

  const authClient = new OAuth2Client();

  let tokenInfo;
  try {
    tokenInfo = await authClient.getTokenInfo(token);
  } catch (e) {
    console.error('Invalid token:', e.message);
    const err = new Error('Unauthorized: Invalid token');
    err.status = 401;
    throw err;
  }

  authClient.setCredentials({ access_token: token });

  return { authClient, token, tokenInfo };
};

/**
 * Helper to create a user-scoped WorkstationsClient using an OAuth access token.
 */
export const getUserScopedClient = async (req) => {
  const { authClient } = await getAuthClient(req);
  return new WorkstationsClient({ authClient });
};

/**
 * Helper to get user-scoped Monitoring Client
 */
export const getMonitoringClient = async (req) => {
  const { authClient } = await getAuthClient(req);
  return new MetricServiceClient({ authClient });
};

/**
 * Helper to get user-scoped Logging Client
 */
export const getLoggingClient = async (req) => {
  const { authClient } = await getAuthClient(req);
  return new Logging({ authClient });
};
