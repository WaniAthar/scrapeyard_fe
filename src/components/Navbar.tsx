
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, KeyRound, Settings } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="w-full py-4 px-6 md:px-12 flex items-center justify-between bg-white border-b">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-primary">
          Scrapeyard
        </Link>
      </div>
      
      <div className="hidden md:flex items-center space-x-6">
        <Link to="/docs" className="text-sm font-medium text-gray-600 hover:text-primary">
          Docs
        </Link>
        
        {isAuthenticated && (
          <>
            <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-primary flex items-center">
              <LayoutDashboard className="mr-1 h-4 w-4" />
              Dashboard
            </Link>
            <Link to="/playground" className="text-sm font-medium text-gray-600 hover:text-primary">
              Playground
            </Link>
            <Link to="/api-keys" className="text-sm font-medium text-gray-600 hover:text-primary flex items-center">
              <KeyRound className="mr-1 h-4 w-4" />
              API Keys
            </Link>
            <Link to="/settings" className="text-sm font-medium text-gray-600 hover:text-primary flex items-center">
              <Settings className="mr-1 h-4 w-4" />
              Settings
            </Link>
          </>
        )}
        
        <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-primary">
          Pricing
        </Link>

        {isAuthenticated ? (
          <Button variant="ghost" className="text-sm font-medium" onClick={logout}>
            Logout
          </Button>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost" className="text-sm font-medium">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="text-sm font-medium">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
      
      <div className="md:hidden">
        {/* Mobile menu button - could be expanded later */}
        <Button variant="ghost" size="sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
