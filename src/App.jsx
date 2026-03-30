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

import { useState, useEffect } from 'react';

import { Terminal, Play, Square, ExternalLink, RefreshCw, Server, Settings, Search, LogOut, LogIn, Trash2, Activity, Zap, PlayCircle, Power } from 'lucide-react';

import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Main Application Component for the Google Cloud Workstations Developer Portal.
 * Handles state management, API communication, and renders the UI for workstation management.
 * 
 * @returns {JSX.Element} The rendered React application.
 */
function App() {
  const [projectId, setProjectId] = useState(localStorage.getItem('gcp_projectId') || 'coffee-and-codey');
  const [workstations, setWorkstations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Deletion State
  const [workstationToDelete, setWorkstationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Authentication State
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // E2E Testing Bypass: Check for test_token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const testToken = params.get('test_token');
    if (testToken && !user) {
        console.log('🛡️ E2E Test Token detected. Bypassing Firebase Auth.');
        setAccessToken(testToken);
        setUser({
            email: 'e2e-tester@google.com',
            displayName: 'E2E Automated Tester'
        });
    }
  }, [user]);

  /**
   * Handles Google Sign-In via Firebase Popup
   */
  const handleLogin = async () => {
    try {
        setError('');
        const result = await signInWithPopup(auth, googleProvider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) setAccessToken(credential.accessToken);
        setUser(result.user);
    } catch (err) {
        setError('Login failed: ' + err.message);
    }
  };

  /**
   * Handles Sign-Out
   */
  const handleLogout = async () => {
      await signOut(auth);
      setUser(null);
      setAccessToken(null);
      setWorkstations([]);
      setHasSearched(false);
  };

  // Save settings
  useEffect(() => {
    localStorage.setItem('gcp_projectId', projectId);
  }, [projectId]);

  /**
   * Discovers and retrieves all Cloud Workstations for the currently set project ID.
   * Updates state with the fetched workstations and handles loading/error states.
   * 
   * @async
   * @returns {Promise<void>}
   */
  const discoverWorkstations = async () => {
    if (!projectId) return setError('Project ID required');
    if (!accessToken) return setError('Not authenticated');

    setLoading(true); setError(''); setHasSearched(true);
    try {
      const url = `${API_URL}/api/workstations/all?projectId=${projectId}`;
      console.log('Fetching workstations from:', url);
      const res = await fetch(url, {
          headers: {
              'Authorization': `Bearer ${accessToken}`
          }
      });
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response from:', url, 'Status:', res.status, 'Body:', text.substring(0, 200));
        throw new Error(`API returned non-JSON (status ${res.status}). Check that VITE_API_URL is correct and the backend is running. URL: ${url}`);
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch workstations');
      setWorkstations(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles POST actions (start, stop) for a specific workstation.
   * 
   * @async
   * @param {string} workstationName - The full resource name of the workstation.
   * @param {'start'|'stop'} action - The action to perform.
   * @returns {Promise<void>}
   */
  const handleAction = async (workstationName, action) => {
    if (!accessToken) return setError('Not authenticated');
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_URL}/api/workstations/${action}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ name: workstationName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${action} workstation`);
      
      // Refresh list to update states
      setTimeout(discoverWorkstations, 3000);
      setTimeout(discoverWorkstations, 8000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  /**
   * Sets the workstation to be deleted, opening the confirmation modal.
   * @param {Object} workstation - The workstation object.
   */
  const confirmDelete = (workstation) => {
    setWorkstationToDelete(workstation);
  };

  /**
   * Cancels the deletion process and closes the modal.
   */
  const cancelDelete = () => {
    setWorkstationToDelete(null);
  };

  /**
   * Executes the deletion of the selected workstation.
   */
  const executeDelete = async () => {
    if (!workstationToDelete) return;
    if (!accessToken) return setError('Not authenticated');

    setIsDeleting(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/workstations/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ name: workstationToDelete.name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete workstation');

      await discoverWorkstations();
      setWorkstationToDelete(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Formats the workstation state string for UI display.
   * Removes 'STATE_' prefix and converts to uppercase.
   * 
   * @param {string} state - The raw state string from the API (e.g., 'STATE_RUNNING').
   * @returns {string} The formatted state string (e.g., 'RUNNING').
   */
  const getStatusString = (state) => {
    if (!state) return 'UNKNOWN';
    return state.replace('STATE_', '').toUpperCase();
  };

  /**
   * Determines if a workstation state is in a terminal (non-transitioning) phase.
   * 
   * @param {string} state - The raw state string from the API.
   * @returns {boolean} True if the state is RUNNING, STOPPED, or UNKNOWN.
   */
  const isTerminalState = (state) => {
    const s = getStatusString(state);
    return ['RUNNING', 'STOPPED', 'UNKNOWN'].includes(s);
  };

  /**
   * Helper to extract the workstation name from a full GCP resource name.
   * @param {string} name - Full resource name.
   * @returns {string} The short workstation name.
   */
  const extractName = (name) => name.split('/').pop();

  /**
   * Helper to extract the location (region/zone) from a full GCP resource name.
   * @param {string} name - Full resource name.
   * @returns {string} The location part of the name.
   */
  const extractLocation = (name) => {
    const parts = name.split('/');
    return parts[parts.indexOf('locations') + 1] || 'Unknown';
  };

  /**
   * Helper to extract the workstation config from a full GCP resource name.
   * @param {string} name - Full resource name.
   * @returns {string} The workstation config part of the name.
   */
  const extractConfig = (name) => {
    const parts = name.split('/');
    return parts[parts.indexOf('workstationConfigs') + 1] || 'Unknown';
  };

  // Render Login View if not authenticated
  if (!user || !accessToken) {
      return (
        <div className="portal-container">
          <div className="hero-section">
            <Terminal size={80} className="text-primary" />
            <h1>Workstation Portal</h1>
            <p>
              The unified hub for managing your Google Cloud Workstations. 
              Deploy, manage, and access your development environments with ease.
            </p>
            
            {error && <div className="error-msg">{error}</div>}
            
            <button className="primary" onClick={handleLogin} style={{fontSize: '1.2rem', padding: '1.25rem 2.5rem', marginTop: '1rem'}}>
                <LogIn size={24} style={{marginRight: '0.8rem'}} />
                Sign in with Google
            </button>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <Activity size={32} />
              <h3>Lifecycle</h3>
              <p>Complete control over your workstations. Create, start, stop, and delete resources directly from the portal.</p>
            </div>
            <div className="feature-card">
              <Settings size={32} />
              <h3>Management</h3>
              <p>Easily manage workstation configurations and labels. Monitor the status and location of your development nodes.</p>
            </div>
            <div className="feature-card">
              <Zap size={32} />
              <h3>Launching</h3>
              <p>Instant access to your workstations. Launch your development environment in the browser with a single click.</p>
            </div>
          </div>
        </div>
      );
  }

  return (
    <div className="portal-container">
      <header>
        <div className="title">
          <Terminal size={32} />
          Workstations Developer Portal
        </div>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
            <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>
                Signed in as {user.email}
            </span>
            <button className="secondary" onClick={discoverWorkstations} disabled={!projectId || loading}>
                <RefreshCw size={20} className={loading ? 'spinner' : ''} />
            </button>
            <button className="secondary" onClick={handleLogout} title="Log Out">
                <LogOut size={20} />
            </button>
        </div>
      </header>

      {error && <div className="error-msg" style={{marginBottom: '1rem'}}>{error}</div>}

      <div className="setup-panel">
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: '600'}}>
          <Search size={20} className="text-primary" /> Auto-Discovery
        </div>
        
        <p className="helper-text" style={{marginTop: '-0.5rem', marginBottom: '0.5rem'}}>
          Enter your Project ID to scan your Google Cloud environment for existing workstation clusters and configurations.
        </p>
        
        <div className="form-row" style={{alignItems: 'flex-end'}}>
          <div className="input-group" style={{flex: 2}}>
            <label>Google Cloud Project ID</label>
            <input 
              value={projectId} 
              onChange={e => setProjectId(e.target.value)} 
              placeholder="e.g. coffee-and-codey" 
            />
            <span className="helper-text">
              Where do I find this? (Check the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">GCP Console</a>)
            </span>
          </div>
          <div className="input-group">
            <button onClick={discoverWorkstations} disabled={loading || !projectId}>
              {loading ? 'Discovering...' : 'Discover Workstations'}
            </button>
          </div>
        </div>
      </div>

      <div className="workstations-grid">
        {workstations.map(ws => {
          const id = extractName(ws.name);
          const location = extractLocation(ws.name);
          const config = extractConfig(ws.name);
          const state = getStatusString(ws.state);
          const isRunning = state === 'RUNNING';
          const isStopped = state === 'STOPPED';
          const loadingState = !isTerminalState(state);
          
          const labels = ws.labels ? Object.entries(ws.labels) : [];

          return (
            <div className="workstation-card" key={ws.name}>
              <div className="card-header">
                <div>
                  <div className="workstation-name">{id}</div>
                  <div className="workstation-id" style={{marginTop: '2px'}}>📍 {location}</div>
                </div>
                <div className={`state-badge state-${state.toLowerCase()}`}>
                  {state}
                </div>
              </div>

              <div>
                <div style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>
                  <Server size={14} style={{display: 'inline', marginRight: '4px'}} /> 
                  Host: {ws.host || 'Not Assigned'}
                </div>
                
                <div className="tags-container">
                  <span className="tag tag-config" title="Workstation Config">⚙️ {config}</span>
                  {labels.map(([key, val]) => (
                    <span className="tag" key={key}>{key}: {val}</span>
                  ))}
                  {/* Display annotations if they exist as tags as well */}
                  {ws.annotations && Object.entries(ws.annotations).map(([k, v]) => (
                     <span className="tag" key={k} title="Annotation">📝 {k}: {v}</span>
                  ))}
                </div>
              </div>

              <div className="card-actions">
                {isStopped ? (
                  <button className="secondary" onClick={() => handleAction(ws.name, 'start')} disabled={loadingState}>
                    <Play size={16} /> Start
                  </button>
                ) : (
                  <button className="secondary" onClick={() => handleAction(ws.name, 'stop')} disabled={loadingState || !isRunning}>
                    <Square size={16} /> Stop
                  </button>
                )}
                
                <button 
                  disabled={!isRunning} 
                  onClick={() => window.open(`https://80-${ws.host}`, '_blank')}
                  title="Launch via browser"
                >
                  <ExternalLink size={16} /> Launch
                </button>

                <button 
                  className="btn-danger" 
                  onClick={() => confirmDelete(ws)}
                  disabled={loadingState}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {workstations.length === 0 && hasSearched && !loading && (
        <div style={{textAlign: 'center', padding: '3rem', color: 'var(--text-muted)'}}>
          <Server size={48} style={{opacity: 0.2, marginBottom: '1rem'}} />
          <p>No workstations found in {projectId}.</p>
        </div>
      )}

      {workstationToDelete && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Delete Workstation</h3>
            <p>
              Are you sure you want to delete workstation {extractName(workstationToDelete.name)}? 
              Depending on the cluster configuration, the associated persistent disk and all data may be permanently deleted.
            </p>
            <div className="modal-actions">
              <button onClick={cancelDelete} disabled={isDeleting}>Cancel</button>
              <button 
                className="btn-danger" 
                onClick={executeDelete} 
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
