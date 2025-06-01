// components/CollapsibleSection.js
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function CollapsibleSection({ title, children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b pb-3 mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-semibold text-gray-700 mb-2"
      >
        {title}
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pl-1">{children}</div>
      </div>
    </div>
  );
}
