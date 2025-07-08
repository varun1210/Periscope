import { FaMapMarkerAlt } from "react-icons/fa";

import type Job from "../models/Job";

interface JobCardProps extends Job {
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
      className={`bg-white border border-gray-200 rounded-lg m-1.5 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Top section */}
      <div className="mb-3 space-y-1">
        <h1 className="text-lg font-semibold text-green-900">{title}</h1>
        <h2 className="text-base text-gray-500">{company}</h2>
      </div>
      
      {/* Bottom section */}
      <div className="flex justify-between items-center text-sm">
        {/* Location on the left */}
        <div className="flex items-center space-x-1 text-gray-500">
          <FaMapMarkerAlt className="w-4 h-4" />
          <span>{location}</span>
        </div>
        
        {/* Pay on the right */}
        <span className="text-green-600 font-medium">
          ${minPay.toLocaleString()} - ${maxPay.toLocaleString()}
        </span>
      </div>
    </div>
  );
}