
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, KeyRound, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Close menu on route change (optional, if using react-router hooks)

  return (
    <nav className="w-full py-4 px-6 md:px-12 flex items-center justify-between bg-white border-b relative z-50">
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
      
      <div className="md:hidden relative">
        <Button variant="ghost" size="sm" onClick={() => setMenuOpen((v) => !v)} aria-label="Open menu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </Button>
        {menuOpen && (
          <div ref={menuRef} className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-4 flex flex-col gap-2 animate-fade-in z-50">
            <Link to="/docs" className="px-6 py-2 text-gray-700 hover:bg-gray-50 text-base font-medium" onClick={() => setMenuOpen(false)}>Docs</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="px-6 py-2 text-gray-700 hover:bg-gray-50 text-base font-medium flex items-center" onClick={() => setMenuOpen(false)}><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
                <Link to="/playground" className="px-6 py-2 text-gray-700 hover:bg-gray-50 text-base font-medium" onClick={() => setMenuOpen(false)}>Playground</Link>
                <Link to="/api-keys" className="px-6 py-2 text-gray-700 hover:bg-gray-50 text-base font-medium flex items-center" onClick={() => setMenuOpen(false)}><KeyRound className="mr-2 h-4 w-4" />API Keys</Link>
                <Link to="/settings" className="px-6 py-2 text-gray-700 hover:bg-gray-50 text-base font-medium flex items-center" onClick={() => setMenuOpen(false)}><Settings className="mr-2 h-4 w-4" />Settings</Link>
              </>
            )}
            <Link to="/pricing" className="px-6 py-2 text-gray-700 hover:bg-gray-50 text-base font-medium" onClick={() => setMenuOpen(false)}>Pricing</Link>
            {isAuthenticated ? (
              <Button variant="ghost" className="mx-4 mt-2 text-base font-medium" onClick={() => { logout(); setMenuOpen(false); }}>Logout</Button>
            ) : (
              <>
                <Link to="/login" className="px-6 py-2 text-gray-700 hover:bg-gray-50 text-base font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="px-6 py-2 text-primary font-semibold hover:bg-gray-50 text-base" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
