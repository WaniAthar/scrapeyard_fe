
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { User, BellRing, Shield, CreditCard, ExternalLink, Save } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login", { state: { from: "/settings" } });
    return null;
  }

  // Sample user data
  const [userData, setUserData] = useState({
    name: "Demo User",
    email: "demo@example.com",
    company: "Demo Company",
    plan: "Free",
  });

  // Sample notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailUpdates: true,
    apiAlerts: true,
    usageReports: false,
    marketingEmails: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
  });

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
  };

  const saveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification preferences updated");
  };

  const saveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Security settings updated");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6 lg:p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User size={16} />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <BellRing size={16} />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield size={16} />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <CreditCard size={16} />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <form onSubmit={saveProfile}>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your account information and how we contact you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={userData.name} 
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={userData.email} 
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input 
                        id="company" 
                        value={userData.company} 
                        onChange={(e) => setUserData({...userData, company: e.target.value})}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <form onSubmit={saveNotifications}>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Configure how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-updates">Email Updates</Label>
                        <p className="text-sm text-gray-500">Receive updates about your account</p>
                      </div>
                      <Switch 
                        id="email-updates" 
                        checked={notificationSettings.emailUpdates}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, emailUpdates: checked})
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="api-alerts">API Alerts</Label>
                        <p className="text-sm text-gray-500">Get notified about API errors and issues</p>
                      </div>
                      <Switch 
                        id="api-alerts" 
                        checked={notificationSettings.apiAlerts}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, apiAlerts: checked})
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="usage-reports">Usage Reports</Label>
                        <p className="text-sm text-gray-500">Receive weekly usage reports</p>
                      </div>
                      <Switch 
                        id="usage-reports" 
                        checked={notificationSettings.usageReports}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, usageReports: checked})
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        <p className="text-sm text-gray-500">Receive product updates and news</p>
                      </div>
                      <Switch 
                        id="marketing-emails" 
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, marketingEmails: checked})
                        }
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <form onSubmit={saveSecurity}>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and authentication settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch 
                        id="two-factor" 
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, twoFactorAuth: checked})
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Select 
                        value={securitySettings.sessionTimeout}
                        onValueChange={(value) => 
                          setSecuritySettings({...securitySettings, sessionTimeout: value})
                        }
                      >
                        <SelectTrigger id="session-timeout" className="w-full">
                          <SelectValue placeholder="Select timeout duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        Your session will expire after this period of inactivity
                      </p>
                    </div>
                    <div className="pt-4">
                      <Button variant="outline" type="button" className="w-full">
                        Change Password
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save Security Settings
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing and Subscription</CardTitle>
                  <CardDescription>
                    Manage your subscription plan and payment details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-2">Current Plan</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">{userData.plan}</p>
                        <p className="text-sm text-gray-500">
                          {userData.plan === "Free" ? "Limited API access" : "Unlimited API access"}
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => navigate("/pricing")}>
                        Upgrade Plan
                      </Button>
                    </div>
                  </div>
                  
                  {userData.plan !== "Free" && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Payment Method</h3>
                      <div className="p-4 border rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <CreditCard className="text-gray-400" />
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-gray-500">Expires 12/2024</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-sm text-gray-600">
                      If you have any questions about your billing or subscription, please contact our support team.
                    </p>
                    <Button variant="link" className="h-auto p-0 text-primary">
                      Contact Support <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
