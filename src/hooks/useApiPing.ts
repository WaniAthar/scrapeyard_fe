import { useEffect } from 'react';
import { toast } from 'sonner';

interface PingConfig {
  urls: string[];
  interval?: number;
  showNotifications?: boolean;
}

export const useApiPing = (config: PingConfig) => {
  const { urls, interval = 5 * 60 * 1000, showNotifications = true } = config;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pingEndpoint = async (url: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          // Add any required headers here
          // headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        console.log(`✅ Successfully pinged ${url}`);
        if (showNotifications) {
          toast.success(`Successfully pinged ${new URL(url).hostname}`);
        }
        return true;
      } catch (error) {
        console.error(`❌ Failed to ping ${url}:`, error);
        if (showNotifications) {
          toast.error(`Failed to ping ${new URL(url).hostname}`);
        }
        return false;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    const pingAllEndpoints = async () => {
      try {
        await Promise.allSettled(urls.map(url => pingEndpoint(url)));
      } catch (error) {
        console.error('Error in pingAllEndpoints:', error);
      }
    };

    // Initial ping
    pingAllEndpoints();

    // Set up interval for subsequent pings
    const intervalId = setInterval(pingAllEndpoints, interval);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [urls, interval, showNotifications]);
};
