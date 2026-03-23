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

import { Terminal, Play, Square, ExternalLink, RefreshCw, Server, Settings, Search } from 'lucide-react';

function App() {
  const [projectId, setProjectId] = useState(localStorage.getItem('gcp_projectId') || 'coffee-and-codey');
  const [workstations, setWorkstations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Save settings
  useEffect(() => {
    localStorage.setItem('gcp_projectId', projectId);
  }, [projectId]);

  const discoverWorkstations = async () => {
    if (!projectId) return setError('Project ID required');
    setLoading(true); setError(''); setHasSearched(true);
    try {
      const res = await fetch(`/api/workstations/all?projectId=${projectId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch workstations');
      setWorkstations(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (workstationName, action) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/workstations/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const getStatusString = (state) => {
    if (!state) return 'UNKNOWN';
    return state.replace('STATE_', '').toUpperCase();
  };

  const isTerminalState = (state) => {
    const s = getStatusString(state);
    return ['RUNNING', 'STOPPED', 'UNKNOWN'].includes(s);
  };

  // Helper to extract nice name from GCP resource name
  const extractName = (name) => name.split('/').pop();
  const extractLocation = (name) => {
    const parts = name.split('/');
    return parts[parts.indexOf('locations') + 1] || 'Unknown';
  };
  const extractConfig = (name) => {
    const parts = name.split('/');
    return parts[parts.indexOf('workstationConfigs') + 1] || 'Unknown';
  };

  return (
    <div className="portal-container">
      <header>
        <div className="title">
          <Terminal size={32} />
          Workstations Developer Portal
        </div>
        <button className="secondary" onClick={discoverWorkstations} disabled={!projectId || loading}>
          <RefreshCw size={20} className={loading ? 'spinner' : ''} />
          Refresh
        </button>
      </header>

      {error && <div className="error-msg" style={{marginBottom: '1rem'}}>{error}</div>}

      <div className="setup-panel">
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: '600'}}>
          <Search size={20} className="text-primary" /> Auto-Discovery
        </div>
        
        <div className="form-row" style={{alignItems: 'flex-end'}}>
          <div className="input-group" style={{flex: 2}}>
            <label>Google Cloud Project ID</label>
            <input 
              value={projectId} 
              onChange={e => setProjectId(e.target.value)} 
              placeholder="e.g. coffee-and-codey" 
            />
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
    </div>
  );
}

export default App;
