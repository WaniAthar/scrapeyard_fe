
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Send request with URL and prompt",
    description: "Specify the website URL along with a natural language prompt describing what data you need and your desired JSON schema."
  },
  {
    number: "02",
    title: "Get structured JSON data",
    description: "Our AI parses the website and returns clean, structured data matching your specified schema format."
  },
  {
    number: "03",
    title: "Integrate with your apps",
    description: "Use the extracted data in your application, database, or analytics tools with simple API integration."
  }
];

const HowItWorksSection = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">How it works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple, powerful, and flexible
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Three simple steps to transform any website into structured data
          </p>
        </div>

        <div className="mt-16">
          <div className="relative">
            {/* Process steps */}
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Step number */}
                  <div className="absolute -left-4 -top-4 bg-primary text-white text-xl font-bold h-12 w-12 rounded-full flex items-center justify-center">
                    {step.number}
                  </div>
                  
                  {/* Step content */}
                  <div className="bg-white p-6 pt-10 rounded-lg shadow-sm border border-gray-100 h-full">
                    <h3 className="text-xl font-medium text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-500">{step.description}</p>
                  </div>
                  
                  {/* Arrow connecting steps (except last) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2">
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
