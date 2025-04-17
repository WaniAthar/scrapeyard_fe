
import { CheckCircle2 } from "lucide-react";

const features = [
  {
    title: "Prompt-based scraping",
    description: "Simply describe what data you want to extract in natural language, and our AI handles the rest.",
    icon: CheckCircle2
  },
  {
    title: "JSON output with schema",
    description: "Get structured data matching your defined JSON schema, ensuring consistent and predictable results.",
    icon: CheckCircle2
  },
  {
    title: "Global reach & fast performance",
    description: "Access websites from around the world with high performance, low latency infrastructure.",
    icon: CheckCircle2
  }
];

const FeaturesSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Powerful web scraping made simple
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Extract exactly what you need from any website with our intelligent scraping technology.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <h3 className="ml-3 text-xl font-medium text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
