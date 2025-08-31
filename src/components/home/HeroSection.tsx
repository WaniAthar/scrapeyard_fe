
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ProcessAnimation from "@/components/home/ProcessAnimation";
import CodeExampleTabs from "../CodeExampleTabs";

const HeroSection = () => {
  return (
    <>
      <section className="w-full bg-white py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
            Extract web data with <span className="text-primary">AI-powered precision</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-8 max-w-2xl">
            Transform any website into structured data with a simple API request. No regex, no XPath, no CSS selectors – just tell us what you need in plain language.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto px-8 py-3">Start for free</Button>
            </Link>
            <Link to="/playground">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3">Try the playground</Button>
            </Link>
          </div>
        </div>
      </section>
      <ProcessAnimation />
      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">SDK Examples in Your Favorite Language</h2>
          <div className="w-full">
            <CodeExampleTabs />
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
