import { FaMapMarkerAlt } from "react-icons/fa";

import type { JobSummary } from "../models/Job";

interface JobCardProps extends JobSummary {
  onClick?: () => void;
  className?: string;
}

export default function JobCard({ 
  title,
  company,
  location,
  minPay,
  maxPay,
  onClick,
  className = ""
}: JobCardProps) {
  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer m-2 ${className}`}
      onClick={onClick}
    >
      {/* Top section */}
      <div className="mb-3 space-y-1">
        <h1 className="text-sm font-semibold text-green-900">{title}</h1>
        <h2 className="text-xs text-gray-500">{company}</h2>
      </div>
      
      {/* Bottom section */}
      <div className="flex justify-between items-center text-xs">
        {/* Location on the left */}
        <div className="flex items-center space-x-1 text-gray-500">
          <FaMapMarkerAlt className="w-3 h-3" />
          <span>{location}</span>
        </div>
        
        {/* Pay on the right */}
        <span className="text-green-600 font-medium">
          {minPay && maxPay ? `\$${(minPay / 1000).toFixed(1)}K - \$${(maxPay / 1000).toFixed(1)}K` : "Unknown"}
        </span>
      </div>
    </div>
  );
}