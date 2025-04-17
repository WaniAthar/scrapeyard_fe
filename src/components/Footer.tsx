
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Scrapeyard</h3>
            <p className="text-sm text-gray-600">
              AI-powered web scraping for developers
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/docs" className="text-sm text-gray-600 hover:text-primary">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/playground" className="text-sm text-gray-600 hover:text-primary">
                  Playground
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-gray-600 hover:text-primary">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-primary">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-primary">
                  Twitter
                </a>
              </li>
              <li>
                <a href="mailto:info@scrapeyard.com" className="text-sm text-gray-600 hover:text-primary">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            &copy; {new Date().getFullYear()} Scrapeyard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
