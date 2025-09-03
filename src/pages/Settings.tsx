import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { User, CreditCard, Save, ExternalLink, Trash2, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getProfile, updateProfile, resetPassword, deleteProfile } from "@/api/profile-api";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface UserData {
  name: string;
  email: string;
  credits: number;
  created_at: string;
  plan: string;
}

const Settings = () => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    credits: 0,
    plan: "Free",
    created_at: ""
  } as UserData);
  
  const [isLoading, setIsLoading] = useState({
    profile: true,
    updatingProfile: false,
    updatingPassword: false,
    deleting: false
  });
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load user profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!accessToken) return;
      
      try {
        const data = await getProfile(accessToken);
        setUserData(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(prev => ({ ...prev, profile: false }));
      }
    };
    
    loadProfile();
  }, [accessToken]);


  const saveProfile = async () => {
    if (!accessToken) return;
    
    setIsLoading(prev => ({ ...prev, updatingProfile: true }));
    
    try {
      const updatedUser = await updateProfile({ name: userData.name }, accessToken);
      setUserData(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(prev => ({ ...prev, updatingProfile: false }));
    }
  };

  const updatePassword = async () => {
    if (!accessToken) return;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    setIsLoading(prev => ({ ...prev, updatingPassword: true }));
    
    try {
      await resetPassword(currentPassword, newPassword, confirmPassword, accessToken);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully!");
    } catch (error: any) {
      console.error("Failed to update password:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsLoading(prev => ({ ...prev, updatingPassword: false }));
    }
  };

  const handleDeleteAccount = async () => {
    if (!accessToken) return;
    
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    
    setIsLoading(prev => ({ ...prev, deleting: true }));
    
    try {
      await deleteProfile(accessToken);
      toast.success("Your account has been deleted successfully.");
      logout();
      navigate("/")
    } catch (error: any) {
      console.error("Failed to delete account:", error);
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsLoading(prev => ({ ...prev, deleting: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <User className="h-8 w-8 text-blue-600" />
                Account Settings
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User size={16} />
                Profile
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <CreditCard size={16} />
                Billing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your basic account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={userData.name} 
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    placeholder="Enter your full name"
                    disabled={isLoading.updatingProfile || isLoading.profile}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Input 
                      id="email" 
                      type="email" 
                      value={userData.email || ''} 
                      disabled
                      className="bg-gray-100 cursor-not-allowed"
                      title="Email address cannot be changed"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm">
                      Cannot be changed
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    For security reasons, email address cannot be changed after registration.
                  </p>
                </div>
                <div className="pt-4">
                  <Button 
                    onClick={saveProfile} 
                    className="w-full sm:w-auto"
                    disabled={isLoading.updatingProfile || isLoading.profile}
                  >
                    {isLoading.updatingProfile ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your account password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    disabled={isLoading.updatingPassword}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 8 characters)"
                    disabled={isLoading.updatingPassword}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={isLoading.updatingPassword}
                  />
                </div>
                <div className="pt-4">
                  <Button 
                    onClick={updatePassword} 
                    className="w-full sm:w-auto"
                    disabled={isLoading.updatingPassword || !currentPassword || !newPassword || !confirmPassword}
                  >
                    {isLoading.updatingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>
                  Permanently delete your account and all data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={isLoading.deleting}
                  className="w-full sm:w-auto"
                >
                  {isLoading.deleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  {isLoading.deleting ? "Deleting..." : "Delete Account"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>
                    Manage your subscription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-blue-900">{userData.plan} Plan</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          {userData.plan === "Free" 
                            ? "Limited features • 100 requests/month" 
                            : "$9/month • Unlimited requests"
                          }
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        {userData.plan === "Free" ? "Upgrade Plan" : "Change Plan"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {userData.plan !== "Free" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>
                      Your billing information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded">
                          <CreditCard className="text-gray-600" size={20} />
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/2025</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Update Card
                      </Button>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Next billing date:</span>
                        <span className="font-medium">January 15, 2025</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">$9.00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Usage This Month</CardTitle>
                  <CardDescription>
                    Track your current usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">API Requests</span>
                      <span className="text-sm font-bold">
                        {userData.plan === "Free" ? "67 / 100" : "1,247 / Unlimited"}
                      </span>
                    </div>
                    {userData.plan === "Free" && (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300" 
                            style={{width: '67%'}}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500">33 requests remaining</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                  <CardDescription>
                    Get support for your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Have questions about your subscription, billing, or need technical support?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="flex-1">
                      Contact Support <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;