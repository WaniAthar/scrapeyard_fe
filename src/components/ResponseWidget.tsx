import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { 
  Loader2, 
  Copy, 
  Check, 
  Download, 
  Maximize2, 
  Minimize2,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileJson,
  Eye,
  Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface ResponseWidgetProps {
  response: any;
  isLoading?: boolean;
  requestTime?: number;
  onRetry?: () => void;
}

const ResponseWidget = ({ response, isLoading, requestTime, onRetry }: ResponseWidgetProps) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw' | 'preview'>('formatted');

  // Fixed height constants
  const FIXED_HEIGHT = '600px';
  const HEADER_HEIGHT = '80px';
  const TAB_NAV_HEIGHT = '52px';
  const FOOTER_HEIGHT = '48px';
  const CONTENT_HEIGHT = `calc(${FIXED_HEIGHT} - ${HEADER_HEIGHT} - ${TAB_NAV_HEIGHT} - ${FOOTER_HEIGHT})`;

  // Process response data
  const processedData = useMemo(() => {
    let formatted = '';
    let hasContent = false;
    let hasError = false;
    let dataType = 'unknown';
    let itemCount = 0;

    try {
      if (response) {
        hasContent = true;
        hasError = !!response.error;

        // Determine data type and count
        if (Array.isArray(response)) {
          dataType = 'array';
          itemCount = response.length;
        } else if (typeof response === 'object' && response !== null) {
          dataType = 'object';
          itemCount = Object.keys(response).length;
        } else {
          dataType = typeof response;
        }

        // Format the response
        if (typeof response === "string") {
          try {
            const parsed = JSON.parse(response);
            formatted = JSON.stringify(parsed, null, 2);
          } catch {
            formatted = response;
          }
        } else {
          formatted = JSON.stringify(response, null, 2);
        }
      }
    } catch (error) {
      console.error('Error processing response:', error);
      formatted = String(response || '');
      hasContent = !!formatted;
      hasError = true;
    }

    return { formatted, hasContent, hasError, dataType, itemCount };
  }, [response]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(processedData.formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([processedData.formatted], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `response-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download:', error);
    }
  };

  const renderPreview = () => {
    if (!processedData.hasContent || processedData.hasError) return null;

    try {
      const data = JSON.parse(processedData.formatted);
      
      if (Array.isArray(data)) {
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 text-sm text-gray-400 border-b border-gray-700/50 pb-2.5 mb-3 flex-shrink-0">
              <FileJson className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">{data.length} items</span>
              <div className="ml-auto text-xs bg-gray-800/50 px-2 py-0.5 rounded">
                array
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1">
              <div className="space-y-2.5">
                {data.slice(0, 8).map((item, index) => (
                  <div 
                    key={index} 
                    className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors"
                  >
                    <div className="text-xs font-mono text-gray-400 mb-1.5">
                      [{index}]
                    </div>
                    <div className="text-sm">
                      {typeof item === 'object' && item !== null ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.entries(item).slice(0, 4).map(([key, val]) => (
                            <div key={key} className="break-words">
                              <span className="text-blue-400 font-medium">{key}</span>
                              <span className="text-gray-500 mx-1">:</span>
                              <span className="text-gray-200">
                                {String(val).length > 24 
                                  ? `${String(val).substring(0, 24)}…`
                                  : String(val)
                                }
                              </span>
                            </div>
                          ))}
                          {Object.keys(item).length > 4 && (
                            <div className="text-xs text-gray-500 italic">
                              + {Object.keys(item).length - 4} more
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="font-mono text-gray-200 break-words">
                          {item === null ? 'null' : String(item)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {data.length > 8 && (
                  <div className="text-center py-3 text-xs text-gray-500 border border-dashed border-gray-700/50 rounded-lg">
                    Showing 8 of {data.length} items
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      } 
      
      if (typeof data === 'object' && data !== null) {
        const entries = Object.entries(data);
        return (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 text-sm text-gray-400 border-b border-gray-700/50 pb-2.5 mb-3 flex-shrink-0">
              <FileJson className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium">{entries.length} properties</span>
              <div className="ml-auto text-xs bg-gray-800/50 px-2 py-0.5 rounded">
                object
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1">
              <div className="space-y-2.5">
                {entries.map(([key, value]) => (
                  <div 
                    key={key} 
                    className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-blue-400 truncate">
                          {key}
                        </div>
                        <div className="mt-1 text-sm text-gray-200 break-words">
                          {value === null ? (
                            <span className="text-gray-500 italic">null</span>
                          ) : Array.isArray(value) ? (
                            <span className="text-gray-400">
                              Array[{value.length}]
                            </span>
                          ) : typeof value === 'object' ? (
                            <span className="text-gray-400">
                              {JSON.stringify(value).length > 60
                                ? `${JSON.stringify(value).substring(0, 60)}…`
                                : JSON.stringify(value)
                              }
                            </span>
                          ) : (
                            String(value)
                          )}
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-2 py-0.5 h-5 flex-shrink-0"
                      >
                        {value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
    } catch (error) {
      return null;
    }
  };

  // Custom scrollbar styles
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `;

  // Loading state
  if (isLoading) {
    return (
      <Card className={cn(
        "border-0 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm",
        isExpanded ? "fixed inset-4 z-50" : ""
      )} style={{ height: isExpanded ? 'calc(100vh - 2rem)' : FIXED_HEIGHT }}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-white">Processing Request</h3>
              <p className="text-sm text-gray-400">
                Extracting data from the webpage...
              </p>
              {requestTime !== undefined && (
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{requestTime}ms elapsed</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (processedData.hasError && response?.error) {
    return (
      <Card className={cn(
        "border-0 bg-gradient-to-br from-red-900/20 to-red-800/10 backdrop-blur-sm border border-red-800/30",
        isExpanded ? "fixed inset-4 z-50" : ""
      )} style={{ height: isExpanded ? 'calc(100vh - 2rem)' : FIXED_HEIGHT }}>
        <CardHeader className="pb-4" style={{ height: HEADER_HEIGHT }}>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-5 w-5" />
            Request Failed
          </CardTitle>
          {requestTime !== undefined && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Failed after {requestTime}ms</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center space-y-4">
          <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
            <h4 className="font-semibold text-red-300 mb-2">{response.error}</h4>
            <p className="text-sm text-red-200/80">{response.message}</p>
          </div>
          
          {response.canRetry && onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              className="w-full border-red-600/30 text-red-400 hover:bg-red-900/30"
            >
              <Loader2 className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!processedData.hasContent) {
    return (
      <Card className={cn(
        "border-0 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm",
        isExpanded ? "fixed inset-4 z-50" : ""
      )} style={{ height: isExpanded ? 'calc(100vh - 2rem)' : FIXED_HEIGHT }}>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto">
              <Code2 className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Ready for Data</h3>
              <p className="text-sm text-gray-400">
                Submit a request to see the extracted data here
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Main content with data - Fixed height structure
  return (
    <Card className={cn(
      "border-0 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm transition-all duration-300 flex flex-col",
      isExpanded ? "fixed inset-4 z-50" : ""
    )} style={{ height: isExpanded ? 'calc(100vh - 2rem)' : FIXED_HEIGHT }}>
      <style>{scrollbarStyles}</style>
      
      {/* Header - Fixed height */}
      <CardHeader className="pb-3 flex-shrink-0" style={{ height: HEADER_HEIGHT }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <CardTitle className="text-lg font-semibold text-white">
                Response Data
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 border-blue-700/30">
                {processedData.dataType}
                {processedData.itemCount > 0 && ` (${processedData.itemCount})`}
              </Badge>
              {requestTime !== undefined && (
                <Badge variant="outline" className="border-green-700/30 text-green-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {requestTime}ms
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50 h-8 w-8 p-0"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50 h-8 w-8 p-0"
              title="Download JSON"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50 h-8 w-8 p-0"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {/* Main Content Area - Flexible height within bounds */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="h-full flex flex-col">
          {/* Tab Navigation - Fixed height */}
          <div className="px-6 pb-3 border-b border-gray-700/50 flex-shrink-0" style={{ height: TAB_NAV_HEIGHT }}>
            <TabsList className="bg-gray-800/50 border border-gray-700/30">
              <TabsTrigger 
                value="preview" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
              <TabsTrigger 
                value="formatted" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Code2 className="h-4 w-4 mr-2" />
                Formatted
              </TabsTrigger>
              <TabsTrigger 
                value="raw" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <FileJson className="h-4 w-4 mr-2" />
                Raw
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Tab Content - Scrollable area with fixed height */}
          <div className="flex-1 overflow-hidden bg-[#0f172a]" style={{ height: CONTENT_HEIGHT }}>
            <TabsContent value="preview" className="h-full m-0">
              <div className="h-full overflow-auto custom-scrollbar p-6">
                {renderPreview()}
              </div>
            </TabsContent>
            
            <TabsContent value="formatted" className="h-full m-0">
              <div className="h-full overflow-auto custom-scrollbar">
                <SyntaxHighlighter
                  className="custom-scrollbar"
                  language="json"
                  style={oneDark}
                  customStyle={{
                    background: "transparent",
                    margin: 0,
                    padding: "1.5rem",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                    height: "100%",
                    minHeight: "100%"
                  }}
                  wrapLines={true}
                  wrapLongLines={true}
                  showLineNumbers={processedData.formatted.split('\n').length > 10}
                  lineNumberStyle={{
                    color: "#64748b",
                    paddingRight: "1rem",
                    fontSize: "0.75rem"
                  }}
                >
                  {processedData.formatted}
                </SyntaxHighlighter>
              </div>
            </TabsContent>
            
            <TabsContent value="raw" className="h-full m-0">
              <div className="h-full overflow-auto custom-scrollbar p-6">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap break-words bg-gray-900/50 p-4 rounded-lg border border-gray-700/30">
                  {processedData.formatted}
                </pre>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      {/* Footer - Fixed height */}
      <div className="px-6 py-2 border-t border-gray-700/50 bg-gray-800/30 flex-shrink-0" style={{ height: FOOTER_HEIGHT }}>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>Size: {new Blob([processedData.formatted]).size} bytes</span>
            <span>Lines: {processedData.formatted.split('\n').length}</span>
          </div>
          {copied && (
            <span className="text-green-400 flex items-center gap-1">
              <Check className="h-3 w-3" />
              Copied!
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ResponseWidget;