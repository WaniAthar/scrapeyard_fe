
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does Scrapeyard's AI scraping work?",
    answer: "Scrapeyard uses advanced AI models to understand web page structure and extract the data you need based on natural language prompts. You simply provide a URL, describe what data you want, and specify your desired output format. Our AI handles the rest, adapting to website changes automatically."
  },
  {
    question: "What websites can I scrape with Scrapeyard?",
    answer: "Scrapeyard can extract data from most public websites. However, we encourage responsible scraping that respects website terms of service and robot.txt files. Some websites with heavy anti-bot measures may have limitations."
  },
  {
    question: "How accurate is the data extraction?",
    answer: "Our AI achieves high accuracy for most structured data extraction tasks. The precision depends on the complexity of the website and the clarity of your prompts. We continuously train and improve our models for better accuracy."
  },
  {
    question: "Do I need technical skills to use Scrapeyard?",
    answer: "Basic programming knowledge is helpful for API integration, but our prompt-based approach makes scraping much simpler than traditional methods. No knowledge of CSS selectors, XPath, or regular expressions is required."
  },
  {
    question: "What are the rate limits?",
    answer: "Rate limits vary by plan. Free tier includes 100 requests per month, while paid plans offer higher limits. Enterprise customers can get custom quotas based on their needs."
  },
  {
    question: "How do I get started?",
    answer: "Sign up for a free account, get your API key, and you can start making requests immediately. Check our documentation for examples and best practices."
  }
];

const FAQSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">FAQ</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </p>
          <p className="mt-4 text-xl text-gray-500">
            Everything you need to know about Scrapeyard
          </p>
        </div>

        <div className="mt-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
