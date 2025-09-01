import { useApiPing } from '@/hooks/useApiPing';
import React from 'react';

interface ApiPingProps {
  /**
   * Array of API endpoints to ping
   * @example ['https://api.example.com/health', 'https://playground.example.com/status']
   */
  endpoints: string[];
  /**
   * Interval in milliseconds between pings
   * @default 300000 (5 minutes)
   */
  interval?: number;
  /**
   * Whether to show toast notifications
   * @default true
   */
  showNotifications?: boolean;
  /**
   * If true, renders a small status indicator
   * @default false
   */
  showStatusIndicator?: boolean;
}

/**
 * Component that periodically pings the specified API endpoints using the Fetch API
 */
const ApiPing: React.FC<ApiPingProps> = ({
  endpoints,
  interval = 5 * 60 * 1000, // 5 minutes
  showNotifications = false,
  showStatusIndicator = false,
}) => {
  useApiPing({
    urls: endpoints,
    interval,
    showNotifications,
  });

  if (!showStatusIndicator) {
    return null;
  }

  return (
    <div className="fixed bottom-2 right-2 text-xs text-gray-500">
      Monitoring {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''}
    </div>
  );
};

export default ApiPing;
