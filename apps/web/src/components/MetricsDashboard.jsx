import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import UsageChart from './UsageChart';
import { RefreshCw, AlertCircle, Loader } from 'lucide-react';

/**
 * Container component for the Vertex AI Metrics Dashboard
 * Responsible for fetching data from the API and rendering charts
 */
const MetricsDashboard = ({ token, userEmail, projectId }) => {
  const [projectMetrics, setProjectMetrics] = useState([]);
  const [userMetrics, setUserMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      const queryParams = projectId ? `?projectId=${projectId}` : '';

      const [projectRes, userRes] = await Promise.all([
        fetch(`/api/metrics/project${queryParams}`, { headers }),
        fetch(`/api/metrics/user${queryParams}`, { headers })
      ]);

      if (!projectRes.ok) {
        const errData = await projectRes.json().catch(() => ({}));
        throw { status: projectRes.status, message: errData.error || `Failed to fetch project metrics: ${projectRes.statusText}` };
      }

      if (!userRes.ok) {
        const errData = await userRes.json().catch(() => ({}));
        throw { status: userRes.status, message: errData.error || `Failed to fetch user metrics: ${userRes.statusText}` };
      }

      const projectData = await projectRes.json();
      const userData = await userRes.json();

      setProjectMetrics(projectData);
      setUserMetrics(userData);
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [token, projectId]);

  useEffect(() => {
    if (token) {
      fetchMetrics();
    }
  }, [token, fetchMetrics]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading metrics from Google Cloud...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-md shadow-sm mt-6">
        <div className="flex items-start">
          <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-semibold text-lg">Failed to Load Metrics</h3>
            <p className="text-red-700 mt-1">{error.message}</p>
            {(error.status === 403 || error.status === 401) && (
              <div className="mt-4 bg-red-100 p-4 rounded text-red-800 text-sm">
                <p className="font-semibold mb-1">Missing Permissions</p>
                <p>
                  You do not have the required Google Cloud IAM roles to view these metrics.
                  Please request the following roles from your administrator:
                </p>
                <ul className="list-disc ml-5 mt-2 font-mono text-xs">
                  <li>roles/monitoring.viewer</li>
                  <li>roles/logging.viewer</li>
                </ul>
              </div>
            )}
            <button 
              onClick={fetchMetrics}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate summaries
  const latestProjectValue = projectMetrics.length > 0 ? projectMetrics[projectMetrics.length - 1].value : 0;
  const latestUserValue = userMetrics.length > 0 ? userMetrics[userMetrics.length - 1].value : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Vertex AI Usage Metrics</h2>
        <button 
          onClick={fetchMetrics}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh Data
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Latest Project Request Count</p>
            <p className="text-3xl font-bold text-gray-900">{latestProjectValue.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
            P
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Your Recent Interactions</p>
            <p className="text-3xl font-bold text-gray-900">{latestUserValue.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">{userEmail}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold">
            U
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UsageChart 
          data={projectMetrics} 
          title="Project Request Count (Last Hour)" 
          color="#3b82f6" 
        />
        <UsageChart 
          data={userMetrics} 
          title={`Your Request Count (Last Hour)`} 
          color="#10b981" 
        />
      </div>
    </div>
  );
};

MetricsDashboard.propTypes = {
  token: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired
};

export default MetricsDashboard;
