
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-12 sm:pb-20">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Extract web data with</span>
                <span className="block text-primary">AI-powered precision</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Transform any website into structured data with a simple API request.
                No regex, no XPath, no CSS selectors - just tell us what you need in plain language.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/signup">
                    <Button size="lg" className="w-full px-8 py-3">
                      Start for free
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/playground">
                    <Button variant="outline" size="lg" className="w-full px-8 py-3">
                      Try the playground
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-100 hidden lg:block">
        <div className="h-full flex items-center justify-center p-12">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            <pre className="text-xs sm:text-sm rounded bg-gray-50 p-4 overflow-x-auto">
{`// Simple API request example
await fetch('https://api.scrapeyard.dev/v1/scrape', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    url: 'https://example.com/products',
    prompt: 'Extract all product information',
    jsonSchema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          price: { type: 'number' },
          inStock: { type: 'boolean' }
        }
      }
    }
  })
})`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
