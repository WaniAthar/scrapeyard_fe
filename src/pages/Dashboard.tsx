
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CodeExampleTabs from "@/components/CodeExampleTabs";
import { useAuth } from "@/context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Database, Globe, Server } from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login", { state: { from: "/dashboard" } });
    return null;
  }

  // Sample data for dashboard
  const usageData = [
    { name: 'Jan', usage: 400 },
    { name: 'Feb', usage: 300 },
    { name: 'Mar', usage: 600 },
    { name: 'Apr', usage: 800 },
    { name: 'May', usage: 500 },
    { name: 'Jun', usage: 900 },
  ];

  const stats = [
    { label: "API Calls", value: "2,543", icon: Globe, color: "text-blue-500" },
    { label: "Scraped Sites", value: "127", icon: Database, color: "text-green-500" },
    { label: "Response Time", value: "230ms", icon: Clock, color: "text-orange-500" },
    { label: "Active Keys", value: "3", icon: Server, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6 lg:p-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <CodeExampleTabs />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-primary/10 ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>API calls over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="usage" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common API management tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/api-keys")}>
                  Generate New API Key
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Export Usage Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Configure Rate Limits
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Test API Endpoint
                </Button>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => navigate("/playground")}>
                  Open Playground
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
