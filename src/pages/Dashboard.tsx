import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

interface DashboardStats {
  successRate: number;
  failureRate: number;
}

interface ActivityLog {
  id: string;
  url?: string;
  timestamp: string;
  error_message?: string;
  status: 'success' | 'error';
}

interface DashboardData {
  email: string;
  credits: number;
  credits_used_this_month: number;
  api_key_count: number;
  stats?: DashboardStats;
  activityLogs: ActivityLog[];
  lastUpdated?: Date;
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, accessToken, getAccessToken } = useAuth();
  const [userEmail, setUserEmail] = useState('');
  
  // Get user email from token
  useEffect(() => {
    const getUserEmail = async () => {
      const token = await getAccessToken();
      if (token) {
        try {
          // Decode the JWT token to get user info
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(window.atob(base64));
          setUserEmail(payload.email || '');
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };

    if (isAuthenticated) {
      getUserEmail();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, getAccessToken]);

  // Fetch dashboard data
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDashboardData = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          navigate('/login');
          return;
        }
        
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/v1/dashboard/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          // Transform the backend response to match the frontend's expected format
          const transformedData: DashboardData = {
            email: userEmail,
            credits: data.credits_remaining || 0,
            credits_used_this_month: data.usage_this_month || 0,
            api_key_count: data.api_key_count || 0,
            stats: {
              successRate: data.success_rate || 0,
              failureRate: data.failure_rate || 0
            },
            activityLogs: data.recent_logs?.map((log: any) => ({
              id: log.id,
              url: log.url,
              timestamp: log.timestamp,
              error_message: log.error_message,
              status: log.status?.toLowerCase() === 'success' ? 'success' : 'error'
            })) || [],
            lastUpdated: new Date()
          };
          setDashboardData(transformedData);
        } else {
          console.error('Failed to fetch dashboard data:', response.status, response.statusText);
          // Set empty data structure if API call fails
          setDashboardData({
            email: userEmail,
            credits: 0,
            credits_used_this_month: 0,
            api_key_count: 0,
            stats: { successRate: 0, failureRate: 0 },
            activityLogs: [],
            lastUpdated: new Date()
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set empty data structure on error
        setDashboardData({
          email: '',
          credits: 0,
          credits_used_this_month: 0,
          api_key_count: 0,
          stats: { successRate: 0, failureRate: 0 },
          activityLogs: [],
          lastUpdated: new Date()
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) return null;

  const Chart = ({ title }: { title: string }) => {
    // Generate empty data for the last 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const emptyData = days.map(day => ({
      name: day,
      value: 0
    }));

    return (
      <div className="h-64 flex flex-col">
        <h4 className="text-sm font-medium text-gray-500 mb-2">{title}</h4>
        <div className="flex-1 flex items-end space-x-1">
          {emptyData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gray-100 rounded-t-sm" 
                style={{ height: '2px' }}
                title={`${day.name}: 0`}
              ></div>
              <span className="text-xs text-gray-400 mt-1">{day.name[0]}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">0 requests</p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Destructure dashboardData with default values
  const {
    email = '',
    credits = 0,
    credits_used_this_month = 0,
    api_key_count = 0,
    stats = { successRate: 0, failureRate: 0 },
    activityLogs = [],
    lastUpdated = new Date()
  } = dashboardData || {};

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Your ScrapeYard activity overview
              {lastUpdated && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  • Last updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Credits Used */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Usage</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {credits_used_this_month.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">used this month</p>
                </div>
              </div>
            </div>

            {/* Success Rate */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Success Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.successRate.toFixed(1) || '0.0'}%
                  </p>
                  <p className="text-xs text-gray-500">of total requests</p>
                </div>
              </div>
            </div>

            {/* Failure Rate */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Failure Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats?.failureRate.toFixed(1) || '0.0'}%
                  </p>
                  <p className="text-xs text-gray-500">of total requests</p>
                </div>
              </div>
            </div>

            {/* API Keys */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">API Keys</p>
                  <p className="text-2xl font-semibold text-gray-900">{api_key_count}</p>
                  <p className="text-xs text-gray-500">
                    {api_key_count === 1 ? 'Active key' : 'Active keys'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Usage Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Analytics</h3>
              <Chart title="Usage Over Time" />
            </div>

            {/* Activity Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Request Activity</h3>
              <Chart title="Request Activity" />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              {activityLogs && activityLogs.length > 0 ? (
                <div className="space-y-4">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {log.url || 'API Request'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                        {log.error_message && (
                          <p className="text-sm text-red-600 mt-1">{log.error_message}</p>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          URL
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Error
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={4}>
                          <div className="text-center py-8">
                            <p className="text-gray-400">No activity logs found</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <p className="text-sm text-gray-900">{email || 'Not available'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Credits
                </label>
                <p className="text-sm text-gray-900">
                  {credits.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Used this month: {credits_used_this_month.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Success Rate
                </label>
                <p className="text-sm text-gray-900">
                  {stats?.successRate.toFixed(1) || '0.0'}%
                </p>
              </div>
            </div>
          </div>
                 
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;