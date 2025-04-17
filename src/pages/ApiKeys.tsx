
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Check, Copy, Key, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

const ApiKeys = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login", { state: { from: "/api-keys" } });
    return null;
  }

  // Sample API keys data
  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Production API Key", key: "sk_prod_xxxxxxxxxxxxxxxxxxxxxxxx", created: "2024-02-15", lastUsed: "2024-04-15", status: "active" },
    { id: "2", name: "Development API Key", key: "sk_dev_xxxxxxxxxxxxxxxxxxxxxxxx", created: "2024-03-10", lastUsed: "2024-04-16", status: "active" },
    { id: "3", name: "Testing API Key", key: "sk_test_xxxxxxxxxxxxxxxxxxxxxxxx", created: "2024-04-01", lastUsed: "2024-04-10", status: "inactive" },
  ]);

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const deleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast.success("API key deleted successfully");
  };

  const generateNewKey = () => {
    const newKey = {
      id: String(apiKeys.length + 1),
      name: "New API Key",
      key: `sk_new_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().slice(0, 10),
      lastUsed: "-",
      status: "active"
    };
    setApiKeys([...apiKeys, newKey]);
    toast.success("New API key generated successfully");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6 lg:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">API Keys</h1>
            <Button onClick={generateNewKey}>
              <Plus className="mr-2 h-4 w-4" /> Generate New Key
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for accessing the Scrapeyard API. Keep your keys secure and never share them publicly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Key size={16} className="text-primary" />
                          {apiKey.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {apiKey.key}
                          </code>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copyToClipboard(apiKey.key)}
                          >
                            {copiedKey === apiKey.key ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{apiKey.created}</TableCell>
                      <TableCell>{apiKey.lastUsed}</TableCell>
                      <TableCell>
                        <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>
                          {apiKey.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this API key? This action cannot be undone and any applications using this key will stop working.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteKey(apiKey.id)} className="bg-red-500 hover:bg-red-600">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Usage Guidelines</CardTitle>
              <CardDescription>Follow these best practices for using your API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Keep your keys secure</h3>
                <p className="text-sm text-gray-600">Never expose your API keys in client-side code, repositories, or public forums.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Use separate keys for different environments</h3>
                <p className="text-sm text-gray-600">Use different API keys for development, testing, and production environments.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Rotate keys periodically</h3>
                <p className="text-sm text-gray-600">Generate new API keys and deprecate old ones on a regular schedule.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApiKeys;
