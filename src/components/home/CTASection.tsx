
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to get started?</span>
          <span className="block text-gray-200">Start your free trial today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
          <div className="inline-flex rounded-md shadow">
            <Link to="/signup">
              <Button 
                variant="default" 
                size="lg" 
                className="bg-white text-primary border-transparent hover:bg-gray-100"
              >
                Get started
              </Button>
            </Link>
          </div>
          <div className="inline-flex rounded-md shadow">
            <Link to="/contact">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-primary-foreground hover:text-primary"
              >
                Contact sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
