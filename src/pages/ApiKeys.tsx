
import { useEffect, useState } from "react";
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
import { getApiKeys, createApiKey, deleteApiKey, regenerateApiKey } from "@/api/auth-api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ApiKeys = () => {
  const { isAuthenticated, accessToken } = useAuth();
  const navigate = useNavigate();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [regeneratedApiKey, setRegeneratedApiKey] = useState<string | null>(null);
  const [isCreateKeyDialogOpen, setIsCreateKeyDialogOpen] = useState(false);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const keys = await getApiKeys(accessToken);
        setApiKeys(keys);
      } catch (error) {
        toast.error(error.message || "Failed to fetch API keys");
      }
    };

    if (isAuthenticated) {
      fetchApiKeys();
    }
  }, [isAuthenticated, accessToken]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login", { state: { from: "/api-keys" } });
    return null;
  }

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const deleteKey = async () => {
    try {
      await deleteApiKey(accessToken);
      toast.success("API key deleted successfully");
      // Refresh the list of keys
      const keys = await getApiKeys(accessToken);
      setApiKeys(keys);
    } catch (error) {
      toast.error(error.message || "Failed to delete API key");
    }
  };

  const generateNewKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const description = (form.elements.namedItem('description') as HTMLInputElement).value;

    try {
      const newKey = await createApiKey(accessToken, { name, description });
      setNewApiKey(newKey.key);
      setIsCreateKeyDialogOpen(false);
      toast.success("New API key generated successfully");
      // Refresh the list of keys
      const keys = await getApiKeys(accessToken);
      setApiKeys(keys);
    } catch (error) {
      toast.error(error.message || "Failed to generate API key");
    }
  };

  const handleRegenerateKey = async () => {
    try {
      const newKey = await regenerateApiKey(accessToken);
      setRegeneratedApiKey(newKey.key);
      toast.success("API key regenerated successfully");
      // Refresh the list of keys
      const keys = await getApiKeys(accessToken);
      setApiKeys(keys);
    } catch (error) {
      toast.error(error.message || "Failed to regenerate API key");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6 lg:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">API Keys</h1>
            <Dialog open={isCreateKeyDialogOpen} onOpenChange={setIsCreateKeyDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Generate New Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Generate New API Key</DialogTitle>
                  <DialogDescription>
                    Give your new API key a name and description to help you identify it.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={generateNewKey}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Name</label>
                      <Input id="name" placeholder="e.g. My Production Key" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium">Description</label>
                      <Input id="description" placeholder="e.g. Used for the main website" />
                    </div>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button type="submit">Generate Key</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Dialog open={!!newApiKey} onOpenChange={() => setNewApiKey(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>API Key Generated Successfully</DialogTitle>
                <DialogDescription>
                  Here is your new API key. Please copy it and store it in a safe place. You will not be able to see it again.
                </DialogDescription>
              </DialogHeader>
              <div className="relative mt-4">
                <Input value={newApiKey || ""} readOnly />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => copyToClipboard(newApiKey || "")}
                >
                  {copiedKey === newApiKey ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <DialogFooter className="mt-4">
                <Button onClick={() => setNewApiKey(null)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={!!regeneratedApiKey} onOpenChange={() => setRegeneratedApiKey(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>API Key Regenerated Successfully</DialogTitle>
                <DialogDescription>
                  Here is your new API key. Please copy it and store it in a safe place. You will not be able to see it again.
                </DialogDescription>
              </DialogHeader>
              <div className="relative mt-4">
                <Input value={regeneratedApiKey || ""} readOnly />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => copyToClipboard(regeneratedApiKey || "")}
                >
                  {copiedKey === regeneratedApiKey ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <DialogFooter className="mt-4">
                <Button onClick={() => setRegeneratedApiKey(null)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
                              <AlertDialogAction onClick={deleteKey} className="bg-red-500 hover:bg-red-600">
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-amber-500">
                              <Key className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Regenerate API Key</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to regenerate your API key? Your old key will stop working immediately. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleRegenerateKey} className="bg-amber-500 hover:bg-amber-600">
                                Regenerate
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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-amber-500">
                <Key className="h-4 w-4 mr-2" />
                Regenerate API Key
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Regenerate API Key</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to regenerate your API key? Your old key will stop working immediately. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {}} className="bg-amber-500 hover:bg-amber-600">
                  Regenerate
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
