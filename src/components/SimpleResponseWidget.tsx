import React, { useState } from 'react';
import { Check, Copy, AlertCircle, Loader2 } from 'lucide-react';

interface SimpleResponseWidgetProps {
  response: any;
  title?: string;
  className?: string;
  loading?: boolean;
  error?: string | null;
}

const SimpleResponseWidget: React.FC<SimpleResponseWidgetProps> = ({
  response,
  title = 'Response',
  className = '',
  loading = false,
  error = null,
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!response) return;
    
    try {
      const text = typeof response === 'string' 
        ? response 
        : JSON.stringify(response, null, 2);
      
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatResponse = (data: any): string => {
    if (!data) return '';
    if (typeof data === 'string') return data;
    return JSON.stringify(data, null, 2);
  };

  const getStatusText = () => {
    if (error) return 'Error';
    if (loading) return 'Loading...';
    if (response?.status === 'error') return 'Error';
    return 'Success';
  };

  const getStatusIcon = () => {
    if (loading) {
      return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
    }
    if (error || response?.status === 'error') {
      return <AlertCircle className="h-4 w-4 text-red-400" />;
    }
    return <Check className="h-4 w-4 text-green-400" />;
  };

  return (
    <div className={`flex flex-col h-full bg-slate-800 border border-slate-700/50 rounded-xl overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-slate-200">{title}</h3>
          <div className={`flex items-center px-2 py-0.5 rounded-full text-xs ${error || response?.status === 'error' ? 'text-red-400' : 'text-green-400'}`}>
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </div>
        </div>
        
        {!loading && (
          <button
            onClick={copyToClipboard}
            className="p-1 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
            disabled={!response}
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 bg-slate-900/30">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading response...</span>
          </div>
        ) : error ? (
          <div className="p-3 bg-red-900/20 rounded-lg text-red-200 text-sm">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Error</h4>
                <p className="mt-1 font-mono text-xs">{error}</p>
              </div>
            </div>
          </div>
        ) : response ? (
          <pre className="font-mono text-xs text-slate-300 overflow-auto max-h-[calc(100vh-300px)]">
            {formatResponse(response)}
          </pre>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleResponseWidget;
