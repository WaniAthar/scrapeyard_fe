import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { PlaygroundApiError } from "@/api/scrape-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { scrape } from "@/api/auth-api";
import ResponseWidget from "@/components/ResponseWidget";
import { toast } from "sonner";
import { 
  Code, 
  Copy, 
  FileText, 
  Globe, 
  Loader2, 
  Play, 
  RotateCcw,
  Sparkles,
  Zap,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import {scrapePlayground } from "@/api/scrape-api";

interface SchemaField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description?: string;
  arrayItemType?: 'string' | 'number' | 'boolean' | 'object';
}

const Playground = () => {
  const { isAuthenticated, accessToken } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [schema, setSchema] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestTime, setRequestTime] = useState<number | null>(null);
  // Connection state
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  // Schema UI state
  const [useUISchema, setUseUISchema] = useState(true);
  const [schemaFields, setSchemaFields] = useState<SchemaField[]>([]);
  const [schemaError, setSchemaError] = useState("");
  const [activeTab, setActiveTab] = useState("request");

  // Predefined examples
  const examples = [
    {
      name: "Extract Open Source Companies",
      url: "https://www.datamation.com/open-source/35-top-open-source-companies/",
      prompt: "Extract the Company name, portfolio, and is_open_source following the schema",
      schema: JSON.stringify({
        type: "object",
        properties: {
          name: { type: "string" },
          portfolio: { type: "string" },
          is_open_source: { type: "boolean" }
        },
        required: ["name", "portfolio", "is_open_source"]
      }, null, 2),
      fields: [
        { id: '1', name: 'name', type: 'string' as const, required: true, description: 'Company name' },
        { id: '3', name: 'portfolio', type: 'string' as const, required: false, description: 'Company portfolio' },
        { id: '4', name: 'is_open_source', type: 'boolean' as const, required: false, description: 'Is open source' }
      ]
    },
    {
      name: "News Article Extraction",
      url: "https://news.google.com",
      prompt: "Extract the headline, author, publication date, and summarized article content under 50 words",
      schema: JSON.stringify({
        type: "object",
        properties: {
          headline: { type: "string" },
          author: { type: "string" },
          publishDate: { type: "string" },
          content: { type: "string" }
        },
        required: ["headline", "content"]
      }, null, 2),
      fields: [
        { id: '1', name: 'headline', type: 'string' as const, required: true, description: 'Article headline' },
        { id: '2', name: 'author', type: 'string' as const, required: false, description: 'Article author' },
        { id: '3', name: 'publishDate', type: 'string' as const, required: false, description: 'Publication date' },
        { id: '4', name: 'content', type: 'string' as const, required: true, description: 'Article content' }
      ]
    },

  ];
  

  // Generate JSON schema from UI fields
  const generateSchemaFromFields = () => {
    if (schemaFields.length === 0) return "";

    const properties: any = {};
    const required: string[] = [];

    schemaFields.forEach(field => {
      if (field.type === 'array' && field.arrayItemType) {
        properties[field.name] = {
          type: 'array',
          items: { type: field.arrayItemType }
        };
      } else {
        properties[field.name] = { type: field.type };
      }

      if (field.description) {
        properties[field.name].description = field.description;
      }

      if (field.required) {
        required.push(field.name);
      }
    });

    const schemaObj = {
      type: "object",
      properties,
      ...(required.length > 0 && { required })
    };

    return JSON.stringify(schemaObj, null, 2);
  };

  // Update schema when fields change
  useEffect(() => {
    if (useUISchema) {
      const generatedSchema = generateSchemaFromFields();
      setSchema(generatedSchema);
    }
  }, [schemaFields, useUISchema]);

  // Validate JSON schema
  const validateSchema = (schemaText: string) => {
    if (!schemaText.trim()) {
      setSchemaError("");
      return true;
    }
    
    try {
      JSON.parse(schemaText);
      setSchemaError("");
      return true;
    } catch (error) {
      setSchemaError("Invalid JSON format");
      return false;
    }
  };

  const handleSchemaChange = (value: string) => {
    setSchema(value);
    validateSchema(value);
  };

  const addSchemaField = () => {
    const newField: SchemaField = {
      id: Date.now().toString(),
      name: '',
      type: 'string',
      required: false,
      description: ''
    };
    setSchemaFields([...schemaFields, newField]);
  };

  const updateSchemaField = (id: string, updates: Partial<SchemaField>) => {
    setSchemaFields(fields => 
      fields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    );
  };

  const removeSchemaField = (id: string) => {
    setSchemaFields(fields => fields.filter(field => field.id !== id));
  };

  const loadExample = (example: any) => {
    setUrl(example.url);
    setPrompt(example.prompt);
    setSchema(example.schema);
    setSchemaFields(example.fields || []);
    setSchemaError("");
    toast.success(`Loaded example: ${example.name}`);
  };

  const clearForm = () => {
    setUrl("");
    setPrompt("");
    setSchema("");
    setSchemaFields([]);
    setSchemaError("");
    setResponse(null);
    setRequestTime(null);
    toast.success("Form cleared");
  };

  const copyAsCode = () => {
    const code = `// cURL example
curl -X POST "https://api.scrapeyard.com/scrape" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "${url}",
    "prompt": "${prompt}",
    "schema": ${schema || "{}"}
  }'

// JavaScript example
const response = await fetch('https://api.scrapeyard.com/scrape', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: "${url}",
    prompt: "${prompt}",
    schema: ${schema || "{}"}
  })
});

const data = await response.json();`;

    navigator.clipboard.writeText(code);
    toast.success("Code examples copied to clipboard!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pre-submission validations
    if (!url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    if (!prompt.trim()) {
      toast.error("Please enter an extraction prompt");
      return;
    }
    
    if (!validateSchema(schema)) {
      toast.error("Please fix the JSON schema before submitting");
      return;
    }
  
    // Check if URL is valid
    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid URL (including http:// or https://)");
      return;
    }
  
    setIsLoading(true);
    setResponse(null);
    setRequestTime(null);
    setActiveTab("response");
  
    const startTime = Date.now();
  
    try {
      const parsedSchema = schema ? JSON.parse(schema) : {};
      
      // Convert schema back to string as the backend expects a string
      const responseData = await scrapePlayground({
        url,
        user_prompt: prompt,
        schema: schema // Send the raw schema string
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      setRequestTime(duration);
      setResponse(responseData.data);
      setRetryCount(0); // Reset retry count on success
      
      toast.success(`Request completed in ${duration}ms`);
      
      // Log success for debugging
      console.log('Scraping successful:', {
        url,
        prompt: prompt.substring(0, 50) + '...',
        duration,
        dataKeys: Object.keys(responseData.data || {})
      });
      
    } catch (error) {
      const endTime = Date.now();
      setRequestTime(endTime - startTime);
      
      if (error instanceof PlaygroundApiError) {
        // Handle specific API errors
        switch (error.statusCode) {
          case 429:
            setResponse({ 
              error: "Rate limit exceeded", 
              message: "You can make 2 requests per minute. Please wait before trying again.",
              canRetry: true,
              retryAfter: 60
            });
            toast.error("Rate limit exceeded. Please wait a minute before trying again.");
            break;
            
          case 400:
            setResponse({ 
              error: "Invalid request", 
              message: error.message,
              canRetry: true 
            });
            toast.error(error.message);
            break;
            
          case 408:
            setResponse({ 
              error: "Request timeout", 
              message: error.message,
              canRetry: true 
            });
            toast.error(error.message);
            break;
            
          case 503:
            setResponse({ 
              error: "Connection failed", 
              message: error.message,
              canRetry: true 
            });
            toast.error(error.message);
            break;
            
          default:
            setResponse({ 
              error: "Scraping failed", 
              message: error.message,
              canRetry: true 
            });
            toast.error(error.message);
        }
      } else {
        // Handle unexpected errors
        setResponse({ 
          error: "Unexpected error", 
          message: "An unexpected error occurred. Please try again.",
          canRetry: true 
        });
        toast.error("An unexpected error occurred");
      }
      
      // Log error for debugging
      console.error('Scraping error:', {
        url,
        error: error.message,
        statusCode: error instanceof PlaygroundApiError ? error.statusCode : 'unknown'
      });
      
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add retry functionality
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      handleSubmit(new Event('submit') as any);
    } else {
      toast.error("Maximum retry attempts reached. Please modify your request.");
    }
  };
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                  API Playground
                </h1>
                <p className="text-gray-600 mt-2">
                  Test and experiment with the ScrapeYard API in real-time
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearForm} size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                <Button variant="outline" onClick={copyAsCode} size="sm">
                  <Code className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Request
              </TabsTrigger>
              <TabsTrigger value="response" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Response
                {response && (
                  <Badge variant="secondary" className="ml-2">
                    {requestTime ? `${requestTime}ms` : 'Ready'}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="request" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Main Request Form */}
                <div className="xl:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-600" />
                        Scraping Request
                      </CardTitle>
                      <CardDescription>
                        Configure your web scraping parameters
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="url" className="text-sm font-medium flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Target URL
                          </label>
                          <Input 
                            id="url" 
                            placeholder="https://example.com" 
                            value={url} 
                            onChange={(e) => setUrl(e.target.value)} 
                            required 
                            className="font-mono text-sm"
                          />
                          <p className="text-xs text-gray-500">
                            The webpage you want to scrape data from
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="prompt" className="text-sm font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Extraction Prompt
                          </label>
                          <Textarea 
                            id="prompt" 
                            placeholder="e.g., Extract all product information including name, price, and description"
                            value={prompt} 
                            onChange={(e) => setPrompt(e.target.value)} 
                            required 
                            rows={3}
                          />
                          <p className="text-xs text-gray-500">
                            Describe what data you want to extract from the page
                          </p>
                        </div>

                        {/* Schema Section */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium flex items-center gap-2">
                              <Code className="h-4 w-4" />
                              Data Schema
                            </label>
                            <div className="flex items-center gap-2">
                              <Label htmlFor="schema-mode" className="text-sm">
                                {useUISchema ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                              </Label>
                              <Switch
                                id="schema-mode"
                                checked={useUISchema}
                                onCheckedChange={setUseUISchema}
                              />
                              <Label htmlFor="schema-mode" className="text-sm">
                                {useUISchema ? 'Visual Builder' : 'Manual JSON'}
                              </Label>
                            </div>
                          </div>

                          {useUISchema ? (
                            // UI Schema Builder
                            <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Define your data structure visually</p>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={addSchemaField}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Field
                                </Button>
                              </div>

                              {schemaFields.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                  <Code className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                  <p className="text-sm">No fields defined yet</p>
                                  <p className="text-xs">Click "Add Field" to start building your schema</p>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {schemaFields.map((field) => (
                                    <div key={field.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                                        <div className="md:col-span-3">
                                          <Label className="text-xs text-gray-500">Field Name</Label>
                                          <Input
                                            placeholder="fieldName"
                                            value={field.name}
                                            onChange={(e) => updateSchemaField(field.id, { name: e.target.value })}
                                            className="mt-1"
                                          />
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                          <Label className="text-xs text-gray-500">Type</Label>
                                          <Select 
                                            value={field.type} 
                                            onValueChange={(value: any) => updateSchemaField(field.id, { type: value })}
                                          >
                                            <SelectTrigger className="mt-1">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="string">String</SelectItem>
                                              <SelectItem value="number">Number</SelectItem>
                                              <SelectItem value="boolean">Boolean</SelectItem>
                                              <SelectItem value="array">Array</SelectItem>
                                              <SelectItem value="object">Object</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        {field.type === 'array' && (
                                          <div className="md:col-span-2">
                                            <Label className="text-xs text-gray-500">Array Items</Label>
                                            <Select 
                                              value={field.arrayItemType || 'string'} 
                                              onValueChange={(value: any) => updateSchemaField(field.id, { arrayItemType: value })}
                                            >
                                              <SelectTrigger className="mt-1">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="string">String</SelectItem>
                                                <SelectItem value="number">Number</SelectItem>
                                                <SelectItem value="boolean">Boolean</SelectItem>
                                                <SelectItem value="object">Object</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        )}

                                        <div className={field.type === 'array' ? "md:col-span-3" : "md:col-span-4"}>
                                          <Label className="text-xs text-gray-500">Description</Label>
                                          <Input
                                            placeholder="Field description"
                                            value={field.description || ''}
                                            onChange={(e) => updateSchemaField(field.id, { description: e.target.value })}
                                            className="mt-1"
                                          />
                                        </div>

                                        <div className="md:col-span-2 flex items-center justify-between gap-5">
                                          <div className="flex items-center space-x-2">
                                            <Switch
                                              id={`required-${field.id}`}
                                              checked={field.required}
                                              onCheckedChange={(checked) => updateSchemaField(field.id, { required: checked })}
                                            />
                                            <Label htmlFor={`required-${field.id}`} className="text-xs text-gray-500">
                                              Required
                                            </Label>
                                          </div>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeSchemaField(field.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Generated Schema Preview */}
                              {schemaFields.length > 0 && (
                                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                                  <Label className="text-xs text-gray-500 mb-2 block">Generated Schema</Label>
                                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                                    {generateSchemaFromFields()}
                                  </pre>
                                </div>
                              )}
                            </div>
                          ) : (
                            // Manual JSON Schema
                            <div className="space-y-2">
                              <Textarea 
                                id="schema" 
                                placeholder={`{
  "type": "object",
  "properties": {
    "title": { "type": "string" },
    "price": { "type": "string" },
    "inStock": { "type": "boolean" }
  }
}`}
                                value={schema} 
                                onChange={(e) => handleSchemaChange(e.target.value)}
                                rows={8}
                                className="font-mono text-sm"
                              />
                              {schemaError && (
                                <p className="text-xs text-red-600 flex items-center gap-1">
                                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                  {schemaError}
                                </p>
                              )}
                              <p className="text-xs text-gray-500">
                                Define the structure of the data you want to extract
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            type="submit" 
                            disabled={isLoading || !!schemaError}
                            className="flex-1"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Scraping...
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Run Scrape
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Examples */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Examples</CardTitle>
                      <CardDescription>
                        Get started with these common use cases
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {examples.map((example, index) => (
                        <button
                          key={index}
                          onClick={() => loadExample(example)}
                          className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                        >
                          <div className="font-medium text-sm text-gray-900 group-hover:text-blue-700">
                            {example.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            {example.prompt}
                          </div>
                        </button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Tips */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">💡 Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="font-medium text-blue-900">Be Specific</p>
                        <p className="text-blue-700 text-xs mt-1">
                          The more specific your prompt, the better the extraction results
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="font-medium text-green-900">Use Visual Builder</p>
                        <p className="text-green-700 text-xs mt-1">
                          The UI schema builder helps create valid JSON schemas easily
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="font-medium text-purple-900">Test URLs</p>
                        <p className="text-purple-700 text-xs mt-1">
                          Start with simple, publicly accessible pages
                        </p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="font-medium text-orange-900">Array Fields</p>
                        <p className="text-orange-700 text-xs mt-1">
                          Use arrays when expecting multiple items (links, prices, etc.)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="response" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <ResponseWidget 
                    response={response} 
                    isLoading={isLoading}
                    requestTime={requestTime}
                  />
                </div>
                
                {/* Response Sidebar */}
                <div className="space-y-6">
                  {/* Request Summary */}
                  {(url || prompt) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Request Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {url && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              URL
                            </label>
                            <p className="text-sm text-gray-900 mt-1 break-all font-mono bg-gray-50 p-2 rounded">
                              {url}
                            </p>
                          </div>
                        )}
                        {prompt && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Prompt
                            </label>
                            <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-2 rounded">
                              {prompt}
                            </p>
                          </div>
                        )}
                        {schema && (
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Schema Fields
                            </label>
                            <div className="mt-2 space-y-1">
                              {schemaFields.length > 0 ? (
                                schemaFields.map(field => (
                                  <div key={field.id} className="flex items-center gap-2 text-xs">
                                    <Badge variant={field.required ? "default" : "secondary"} className="text-xs">
                                      {field.name}
                                    </Badge>
                                    <span className="text-gray-500">
                                      {field.type === 'array' ? `${field.type}[${field.arrayItemType}]` : field.type}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-gray-500">Manual schema in use</p>
                              )}
                            </div>
                          </div>
                        )}
                        {requestTime && (
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <span className="text-sm font-medium text-green-700">Response Time</span>
                            <Badge variant="secondary">{requestTime}ms</Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Response Actions */}
                  {response && !isLoading && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(response, null, 2));
                            toast.success("Response copied to clipboard!");
                          }}
                          className="w-full"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Response
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab("request")}
                          className="w-full"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Modify Request
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Status Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Request Status</span>
                          <Badge variant={isLoading ? "secondary" : response ? "default" : "outline"}>
                            {isLoading ? "Processing" : response ? "Complete" : "Ready"}
                          </Badge>
                        </div>
                        {requestTime && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Response Time</span>
                            <span className="text-sm font-mono">{requestTime}ms</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Schema Mode</span>
                          <Badge variant="outline">
                            {useUISchema ? "Visual Builder" : "Manual JSON"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Playground;