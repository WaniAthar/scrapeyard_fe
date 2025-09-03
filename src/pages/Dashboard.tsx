import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Activity, Clock, AlertCircle, CheckCircle, Key, Calendar, BarChart3, Download, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface UsageDataPoint {
  name: string;
  usage: number;
  successful?: number;
  credits_used?: number;
}

interface RecentLog {
  id: number;
  status: 'pending' | 'success' | 'failed' | 'timeout';
  timestamp: string;
  url?: string;
  error_message?: string;
}

interface UsageTrend {
  trend: 'increasing' | 'decreasing' | 'stable';
  change_percentage: number;
}

interface DashboardData {
  user_name: string;
  email: string;
  credits: number;
  total_calls: number;
  successful_calls: number;
  failed_calls: number;
  timeout_calls: number;
  success_rate: number;
  credits_used_this_month: number;
  credits_used_period: number;
  avg_daily_usage: number;
  peak_usage: number;
  usage_data: UsageDataPoint[];
  recent_logs: RecentLog[];
  api_key_count: number;
  recently_used_api_keys: number;
  usage_trend: UsageTrend;
  period_days: number;
}

const Dashboard: React.FC = () => {
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData(selectedPeriod);
  }, [selectedPeriod]);

  const fetchDashboardData = async (days: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      const API_URL = import.meta.env.VITE_API_URL;
      const apiUrl = `${API_URL}/dashboard/data?days=${days}`;
      console.log('Fetching dashboard data from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      const responseText = await response.text();
      
      try {
        const data = JSON.parse(responseText);
        if (response.ok) {
          console.log('Dashboard data received:', data);
          setDashboardData(data);
        } else {
          console.error('API Error:', data);
          throw new Error(data.detail || 'Failed to fetch dashboard data');
        }
      } catch (jsonError) {
        console.error('Failed to parse JSON response. Response:', responseText);
        throw new Error('Invalid response from server. Please try again later.');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = (days: number) => {
    setSelectedPeriod(days);
  };

  const TrendIndicator = ({ trend, changePercentage = 0 }: { trend?: string; changePercentage?: number }) => {
    if (!trend || changePercentage === 0) return null;
    
    return (
      <div className="flex items-center space-x-1">
        {trend === 'increasing' && <TrendingUp className="h-4 w-4 text-green-500" />}
        {trend === 'decreasing' && <TrendingDown className="h-4 w-4 text-red-500" />}
        {trend === 'stable' && <Minus className="h-4 w-4 text-muted-foreground" />}
        <span className={`text-sm font-medium ${
          trend === 'increasing' ? 'text-green-500' : 
          trend === 'decreasing' ? 'text-red-500' : 
          'text-muted-foreground'
        }`}>
          {changePercentage > 0 ? '+' : ''}{changePercentage.toFixed(1)}%
        </span>
      </div>
    );
  };

  // Helper function to safely calculate values
  const safeCalculate = (numerator: number, denominator: number, defaultValue: number = 0): number => {
    if (!denominator || denominator === 0) return defaultValue;
    return numerator / denominator;
  };

  // Helper function to safely format numbers
  const safeFormat = (value: number | undefined | null, defaultValue: string = '0'): string => {
    if (value === undefined || value === null || isNaN(value)) return defaultValue;
    return value.toLocaleString();
  };

  // Helper function to safely format decimal numbers
  const safeFormatDecimal = (value: number | undefined | null, decimals: number = 1, defaultValue: string = '0'): string => {
    if (value === undefined || value === null || isNaN(value)) return defaultValue;
    return value.toFixed(decimals);
  };

  // Add default values and calculations for missing fields
  const dashboardDataWithDefaults = dashboardData ? {
    ...dashboardData,
    timeout_calls: dashboardData.timeout_calls || 0,
    success_rate: dashboardData.total_calls > 0 ? 
      Math.round((dashboardData.successful_calls / dashboardData.total_calls) * 100) : 0,
    credits_used_period: dashboardData.credits_used_period || dashboardData.credits_used_this_month || 0,
    avg_daily_usage: dashboardData.period_days > 0 ? 
      safeCalculate(dashboardData.total_calls, dashboardData.period_days) : 0,
    peak_usage: dashboardData.peak_usage || Math.max(...(dashboardData.usage_data?.map(d => d.usage) || [0])),
    recently_used_api_keys: dashboardData.recently_used_api_keys || dashboardData.api_key_count || 0,
    period_days: dashboardData.period_days || 30,
    usage_trend: dashboardData.usage_trend || { trend: 'stable', change_percentage: 0 }
  } : null;

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    trend, 
    showTrend = false 
  }: {
    icon: any;
    title: string;
    value: string;
    subtitle?: string;
    trend?: UsageTrend;
    showTrend?: boolean;
  }) => (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          </div>
          {showTrend && trend && (
            <div className="text-right">
              <TrendIndicator trend={trend.trend} changePercentage={trend.change_percentage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 text-green-700 border-green-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      case 'timeout': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'timeout': return <Clock className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-12">
              <div className="text-center max-w-md mx-auto">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-lg bg-muted mb-6">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Welcome to ScrapeYard</h2>
                <p className="text-muted-foreground mb-8">
                  Start making API requests to see your usage statistics, activity logs, and analytics here.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button onClick={() => navigate("/api-keys")} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    Make Your First Request
                  </button>
                  <button onClick={() => navigate("/docs")} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    View Documentation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Analytics for the last {dashboardData.period_days} days
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                {[7, 14, 30, 90].map((days) => (
                  <button
                    key={days}
                    onClick={() => handlePeriodChange(days)}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                      selectedPeriod === days
                        ? 'bg-background text-foreground shadow-sm'
                        : 'hover:bg-background/60'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              icon={Activity}
              title="Total Requests"
              value={safeFormat(dashboardDataWithDefaults?.total_calls)}
              subtitle={`${safeFormatDecimal(dashboardDataWithDefaults?.avg_daily_usage)} avg/day`}
              trend={dashboardDataWithDefaults?.usage_trend}
              showTrend={true}
            />
            
            <StatCard
              icon={CheckCircle}
              title="Success Rate"
              value={`${dashboardDataWithDefaults?.success_rate || 0}%`}
              subtitle={`${safeFormat(dashboardDataWithDefaults?.successful_calls)} successful`}
            />
            
            <StatCard
              icon={Calendar}
              title="Credits Used"
              value={safeFormat(dashboardDataWithDefaults?.credits_used_period)}
              subtitle={`${safeFormat(dashboardDataWithDefaults?.credits)} remaining`}
            />
            
            <StatCard
              icon={Key}
              title="API Keys"
              value={safeFormat(dashboardDataWithDefaults?.api_key_count)}
              subtitle={`${safeFormat(dashboardDataWithDefaults?.recently_used_api_keys)} recently active`}
              showTrend={false}
            />
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-7 mb-8">
            
            {/* Usage Chart */}
            <div className="md:col-span-5 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Usage Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      API requests over the last {dashboardData.period_days} days
                    </p>
                  </div>
                  <TrendIndicator 
                    trend={dashboardData.usage_trend?.trend} 
                    changePercentage={dashboardData.usage_trend?.change_percentage} 
                  />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboardData.usage_data || []}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="name" 
                        className="text-xs fill-muted-foreground"
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis className="text-xs fill-muted-foreground" />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value, name) => [
                          value, 
                          name === 'usage' ? 'Total Requests' : 
                          name === 'successful' ? 'Successful' : 
                          name === 'credits_used' ? 'Credits Used' : name
                        ]}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          color: 'hsl(var(--card-foreground))'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="usage" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                      {dashboardData.usage_data?.some(d => d.successful !== undefined) && (
                        <Area 
                          type="monotone" 
                          dataKey="successful" 
                          stroke="hsl(var(--green-500))" 
                          fill="hsl(var(--green-500))"
                          fillOpacity={0.05}
                          strokeWidth={1}
                          strokeDasharray="5 5"
                        />
                      )}
                      {dashboardData.usage_data?.some(d => d.credits_used !== undefined && d.credits_used > 0) && (
                        <Area 
                          type="monotone" 
                          dataKey="credits_used" 
                          stroke="hsl(var(--orange-500))" 
                          fill="hsl(var(--orange-500))"
                          fillOpacity={0.05}
                          strokeWidth={1}
                          strokeDasharray="3 3"
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="md:col-span-2 space-y-4">
              
              {/* Success Breakdown */}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <h4 className="font-semibold mb-4">Request Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm">Successful</span>
                      </div>
                      <span className="text-sm font-medium">{safeFormat(dashboardData.successful_calls)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-sm">Failed</span>
                      </div>
                      <span className="text-sm font-medium">{safeFormat(dashboardData.failed_calls)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">Timeout</span>
                      </div>
                      <span className="text-sm font-medium">{safeFormat(dashboardData.timeout_calls)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Peak Usage */}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <h4 className="font-semibold mb-2">Peak Usage</h4>
                  <p className="text-2xl font-bold">{safeFormat(dashboardDataWithDefaults?.peak_usage)}</p>
                  <p className="text-xs text-muted-foreground">highest single day</p>
                </div>
              </div>

              {/* Credits Efficiency */}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <h4 className="font-semibold mb-2">Avg Cost</h4>
                  <p className="text-2xl font-bold">
                    {dashboardData.total_calls > 0 && dashboardDataWithDefaults?.credits_used_period
                      ? safeFormatDecimal(safeCalculate(dashboardDataWithDefaults.credits_used_period, dashboardData.total_calls), 2)
                      : '0.00'
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">credits per request</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-8">
            <div className="border-b bg-muted/50 px-6 py-4">
              <h3 className="font-semibold">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">Latest API requests and their status</p>
            </div>
            <div className="p-6">
              {dashboardData.recent_logs && dashboardData.recent_logs.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recent_logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 rounded-md border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-md border ${getStatusColor(log.status)}`}>
                          {getStatusIcon(log.status)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {log.url || 'API Request'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                          {log.error_message && (
                            <p className="text-sm text-destructive mt-1 truncate">
                              {log.error_message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getStatusColor(log.status)}`}>
                        {log.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-1">No activity yet</h3>
                  <p className="text-sm text-muted-foreground">Your recent API requests will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="border-b bg-muted/50 px-6 py-4">
              <h3 className="font-semibold">Account Information</h3>
              <p className="text-sm text-muted-foreground">Your account details and current usage</p>
            </div>
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Account Holder</h4>
                  <p className="font-medium">{dashboardData.user_name}</p>
                  <p className="text-sm text-muted-foreground">{dashboardData.email}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Available Credits</h4>
                  <p className="text-2xl font-bold">{safeFormat(dashboardData.credits)}</p>
                  <p className="text-sm text-muted-foreground">
                    {safeFormat(dashboardData.credits_used_this_month)} used this month
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Performance</h4>
                  <p className="text-2xl font-bold">{dashboardDataWithDefaults?.success_rate}%</p>
                  <p className="text-sm text-muted-foreground">
                    {safeFormat(dashboardData.total_calls)} total requests
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">API Integration</h4>
                  <p className="text-2xl font-bold">{safeFormat(dashboardData.api_key_count)}</p>
                  <p className="text-sm text-muted-foreground">
                    {safeFormat(dashboardData.recently_used_api_keys)} active recently
                  </p>
                </div>
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