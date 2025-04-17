import React, { useEffect, useState } from "react";

// Simple, robust: scan -> arrow -> response (no typing, no loop, no triggers)
const ProcessAnimation = () => {
  // Arrow position: true = right, false = left
  const [arrowRight, setArrowRight] = useState(false);
  const response = `[
    {
    "url": "https://example.com",
    "markdown": "# Getting started...",
    "json": { "title": "Guido", "docs": ... },
    "screenshot": "https://example.com/hero.png"
  }
]`;

  // Arrow independent loop
  useEffect(() => {
    const timeout = setTimeout(() => setArrowRight(r => !r), 1100);
    return () => clearTimeout(timeout);
  }, [arrowRight]);

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 py-8 select-none">

      {/* Browser mockup with scanning bar */}
      <div className="relative flex-shrink-0 shadow-[0_0_24px_4px_rgba(59,130,246,0.15)] transition-shadow duration-500">
        <div className="w-[320px] h-[260px] bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden transition-shadow duration-500">
          {/* Browser bar */}
          <div className="flex items-center gap-2 h-7 px-4 bg-gray-100 rounded-t-2xl border-b border-gray-200">
            <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
            <div className="ml-4 h-3 w-24 bg-gray-200 rounded" />
          </div>
          {/* Content blocks */}
          <div className="flex-1 flex flex-col gap-2 p-4 relative">
            <div className="h-7 w-32 bg-gray-200 rounded" />
            <div className="h-14 w-full bg-gray-100 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            {/* Scanning animation (independent CSS infinite loop) */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-0 top-0 w-full h-full animate-scan-bar bg-gradient-to-b from-transparent via-blue-300/40 to-transparent" style={{animationDuration: '1.2s', animationIterationCount: 'infinite'}} />
              <div className="absolute left-0 top-0 w-full h-full animate-scan-bar-delay bg-gradient-to-b from-transparent via-blue-400/60 to-transparent" style={{animationDuration: '1.2s', animationDelay: '1.1s', animationIterationCount: 'infinite'}} />
            </div> 
          </div>
        </div>
      </div>
      {/* Animated left-right arrow (independent loop, easeInOut) */}
      <div className="flex flex-col items-center justify-center min-w-[64px] h-44 relative">
        <svg
          width="40" height="40" fill="none" viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            top: '50%',
            left: arrowRight ? '60%' : '0%',
            transform: 'translateY(-50%)',
            transition: 'left 1.1s cubic-bezier(0.42,0,0.58,1)',
            opacity: 1,
          }}
        >
          <path d="M4 12h16m0 0l-6-6m6 6l-6 6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {/* Response card */}
      <div className="w-150 h-[260px] bg-[#181A20] rounded-2xl shadow-2xl border border-gray-900 p-0 flex flex-col">
        <div className="px-6 pt-4 pb-2 border-b border-gray-800 text-xs text-gray-400 font-mono">200 Response</div>
        <pre className="flex-1 rounded-b-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-orange-200 text-xs sm:text-sm font-mono p-6 overflow-x-auto">
          {response}
        </pre>
      </div>
      {/* Animation keyframes */}
      <style>{`
        @keyframes scan-bar {
          0% { opacity: 0; transform: translateY(-100%); }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(100%); }
        }
        @keyframes scan-bar-delay {
          0% { opacity: 0; transform: translateY(-100%); }
          30% { opacity: 0; }
          40% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; transform: translateY(100%); }
        }
        .animate-scan-bar {
          animation: scan-bar 1.2s linear 1;
        }
        .animate-scan-bar-delay {
          animation: scan-bar-delay 1.2s linear 1;
        }
        @keyframes ai-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.18); }
        }
        .animate-ai-pulse {
          animation: ai-pulse 1.2s infinite;
        }
      `}</style>
    </div>
  );
};

export default ProcessAnimation;
