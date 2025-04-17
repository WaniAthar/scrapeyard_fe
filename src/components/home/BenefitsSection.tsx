
import { BadgeCheck, Clock, Lock, Zap } from "lucide-react";

const benefits = [
  {
    title: "Save development time",
    description: "No more writing brittle scraping code. Let our AI handle the complexities of web data extraction.",
    icon: Clock
  },
  {
    title: "Easy integration",
    description: "Simple REST API that works with any programming language or platform. No SDKs or libraries needed.",
    icon: Zap
  },
  {
    title: "Secure & scalable",
    description: "Enterprise-grade infrastructure that scales with your needs, with bank-level security for your data.",
    icon: Lock
  },
  {
    title: "Reliable results",
    description: "Our AI adapts to website changes, ensuring your data extraction remains consistent over time.",
    icon: BadgeCheck
  }
];

const BenefitsSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Benefits</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Why developers choose Scrapeyard
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Focus on building your applications, not on scraping data
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-4">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
