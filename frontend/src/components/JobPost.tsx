import type { Job } from "../models/Job";
import axios from "axios";

export default function JobPost(job: Job) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Job title as heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>

      {/* Company as subtitle */}
      <h2 className="text-xl text-gray-600 mb-4">{job.company}</h2>

      {/* Location and salary row */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
        <span className="text-gray-700 font-medium">{job.location}</span>
        <span className="text-green-600 font-semibold text-lg">
          {job.minPay && job.maxPay ? `\$${job.minPay.toLocaleString()} - \$${job.maxPay.toLocaleString()}` : "Pay not disclosed"}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mb-6">
        <button className="flex-1 bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 hover:cursor-pointer transition-colors">
          Save
        </button>
        <button className="flex-1 bg-gray-50 text-green-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 hover:cursor-pointer transition-colors">
          Mark Applied
        </button>
        <button className="flex-1 bg-green-900 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-800 transition-colors">
          <a href={job.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            Apply
          </a>
        </button>
      </div>

      {/* Job description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Job Description
        </h3>
        <p className="text-gray-700 leading-relaxed">{job.jobDescription}</p>
      </div>
    </div>
  );
}