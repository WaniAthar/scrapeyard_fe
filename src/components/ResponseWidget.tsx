import React from "react";

interface ResponseWidgetProps {
  response: string;
  showContent?: boolean;
  show?: boolean;
  heightClass?: string; // Optional Tailwind height class, e.g. 'h-64', 'min-h-[200px]'
}

const ResponseWidget: React.FC<ResponseWidgetProps> = ({ response, showContent, show = true, heightClass }) => {
  // Default to min-h-[180px] if no heightClass provided
  const height = heightClass || 'min-h-[180px]';
  return (
    <div className={`w-150 ${height} bg-[#181A20] rounded-2xl shadow-2xl border border-gray-900 p-0 flex flex-col transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <div className="px-6 pt-4 pb-2 border-b border-gray-800 text-xs text-gray-400 font-mono">200 Response</div>
      <pre
        className={`flex-1 min-h-[120px] rounded-b-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-orange-200 text-xs sm:text-sm font-mono p-6 overflow-x-auto whitespace-pre-wrap`}
      >
        <div
          className={`transition-all duration-300 ease-out inline-block w-full h-full
            ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
          style={{ willChange: 'opacity, transform' }}
        >
          {response}
        </div>
      </pre>
    </div>
  );
};


export default ResponseWidget;
