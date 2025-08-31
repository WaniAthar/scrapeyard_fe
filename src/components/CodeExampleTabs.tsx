import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Highlight } from "prism-react-renderer";
import dracula from '../themes/dracula';
import { Copy, Play, Pause } from "lucide-react";
import ResponseWidget from "./ResponseWidget";

const codeExamples = {
  python: {
    label: "Python",
    code: `
# pip install scrapeyard

from scrapeyard import ScrapeYard
from pydantic import BaseModel, Field
from typing import List

scrapyard = ScrapeYard(api_key="sk-live-1234...")

# Define schema to extract contents into
class Product(BaseModel):
    name: str
    price: float
    in_stock: bool

result = scrapyard.scrape(
    url="https://example.com/products",
    schema=Product.model_json_schema(),
    prompt="Extract all products with name, price, and in_stock status."
)
`,

    output: `[
  {
    "name": "SuperWidget",
    "price": 19.99,
    "in_stock": true
  }
]`
  },
  NodeJS: {
    label: "NodeJs",
    code: `import { ScrapeYard } from 'scrapeyard-sdk';
import { z } from 'zod';

const scrapyard = new ScrapeYard({ apiKey: 'sk-live-1234...' });

const ProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  in_stock: z.boolean()
});

const ProductsSchema = z.array(ProductSchema);

const result = await scrapyard.scrape({
  url: 'https://example.com/products',
  schema: ProductsSchema,
  prompt: 'Extract all products with name, price, and in_stock status.'
});

`,
    output: `[
  {
    name: "SuperWidget",
    price: 19.99,
    in_stock: true
  }
]`
  },
  curl: {
    label: "cURL",
    code: `curl -X POST https://api.firecrawl.dev/v1/extract \\
    -H "Authorization: Bearer fc-YOUR_API_KEY" \\
    -H "Content-Type: application/json" \\
    -d '{ 
      "urls": [
        "https://docs.firecrawl.dev/*",
        "https://firecrawl.dev/",
        "https://www.ycombinator.com/companies/"
      ],
      "prompt": "Extract the data provided in the schema.",
      "schema": {
        "company_mission": "string",
        "supports_sso": "boolean",
        "is_open_source": "boolean",
        "is_in_yc": "boolean"
      }
    }'`,
    output: `[
    {
      "company_mission": "To make web scraping simple",
      "supports_sso": true,
      "is_open_source": false,
      "is_in_yc": true
    },
    {
      "company_mission": "Empowering developers with AI-first scraping tools",
      "supports_sso": false,
      "is_open_source": true,
      "is_in_yc": false
    }
  ]`
  }
};


function mapLanguage(lang: string) {
  const map: Record<string, string> = {
    python: "python",
    javascript: "javascript",
    typescript: "typescript",
    java: "java",
    go: "go",
    curl: "bash",
    bash: "bash"
  };
  return map[lang.toLowerCase()] || "javascript";
}

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative mt-2">
      <Highlight code={code} language={mapLanguage(language)} theme={dracula}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white text-sm font-mono p-5 overflow-x-auto border border-gray-900 shadow-xl ${className}`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

const CodeExampleTabs = () => {
  const [showOutput, setShowOutput] = useState(false);
  const [activeTab, setActiveTab] = useState("python");

  // Find the output for the current tab
  const currentOutput = codeExamples[activeTab]?.output || "No output available.";

  async function handleCopy(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    event.preventDefault();
    const code = codeExamples[activeTab]?.code || "";
    try {
      await navigator.clipboard.writeText(code);
      // Optional: Visual feedback, e.g., set copied state
    } catch (err) {
      // Optionally handle error
    }
  }

  return (
    <div className="my-10 flex justify-center w-full relative">
      {/* ResponseWidget Overlay */}
      {showOutput && (
        <FadeResponseOverlay output={currentOutput}/>
      )}
      <div className="w-full max-w-3xl rounded-2xl bg-gradient-to-br from-[#181A20] to-[#23272f] shadow-2xl border border-gray-900 px-0 sm:px-2 py-8 relative">
      
        <Tabs defaultValue="python" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex items-center justify-between gap-2 bg-transparent border-none px-2">
            <div className="flex gap-2">
              {Object.entries(codeExamples).map(([key, { label }]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="rounded-full px-5 py-2 text-sm font-semibold bg-gray-800 text-gray-200 data-[state=active]:bg-primary data-[state=active]:text-white shadow-none border-none transition"
                >
                  {label}
                </TabsTrigger>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                className="p-2 rounded-full hover:bg-gray-800 transition"
                onClick={() => setShowOutput((v) => !v)}
                title={showOutput ? "Pause" : "Play"}
                type="button"
              >
                {showOutput ? (
                  <Pause className="w-5 h-5 text-gray-200" />
                ) : (
                  <Play className="w-5 h-5 text-gray-200" />
                )}
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-800 transition"
                onClick={handleCopy}
                title="Copy code"
                type="button"
              >
                <Copy className="w-5 h-5 text-gray-200" />
              </button>
            </div>
          </TabsList>
          {Object.entries(codeExamples).map(([key, { code, label, output }]) => (
            <TabsContent key={key} value={key}>
              <div className="flex flex-col gap-6 px-4 sm:px-8">
                <CodeBlock code={code} language={label} />
              </div>
            </TabsContent>

            
          ))}
        </Tabs>
       
      </div>
    </div>
  );
};

const FadeResponseOverlay = ({ output }: { output: string }) => {
  const [showCard, setShowCard] = useState(false);
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    setShowCard(false);
    setShowContent(false);
    const cardTimeout = setTimeout(() => setShowCard(true), 10); 
    const contentTimeout = setTimeout(() => setShowContent(true), 400);
    return () => {
      clearTimeout(cardTimeout);
      clearTimeout(contentTimeout);
    };
  }, [output]);
  return (
    <div className="w-[350px] absolute bottom-10 right-0 z-[50]">
      <ResponseWidget response={output} />
    </div>
  );
};

export default CodeExampleTabs;

