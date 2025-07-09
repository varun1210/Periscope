import { FaMapMarkerAlt } from "react-icons/fa";

import type { JobSummary } from "../models/Job";

export default function JobTile(job: JobSummary) {
    return (
        <div className="grid gap-2 sm:gap-3 p-2 sm:p-3 items-center h-12 sm:h-14" 
             style={{ gridTemplateColumns: '1.5fr 2.5fr 1fr 1fr' }}>
            <div className="flex font-medium justify-start items-center text-xs sm:text-sm min-w-0">
                <b className="break-words overflow-hidden" 
                   style={{ 
                     display: '-webkit-box',
                     WebkitLineClamp: 2,
                     WebkitBoxOrient: 'vertical',
                     lineHeight: '1.2em',
                     maxHeight: '2.4em'
                   }}>
                    {job.company}
                </b>
            </div>
            <div className="flex font-normal justify-start items-center text-xs sm:text-sm min-w-0">
                <span className="break-words overflow-hidden" 
                      style={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.2em',
                        maxHeight: '2.4em'
                      }}>
                    {job.title}
                </span>
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm min-w-0">
                <FaMapMarkerAlt className="text-gray-500 text-xs flex-shrink-0" />
                <span className="truncate">{job.location}</span>
            </div>
            <div className="flex justify-end items-center text-green-600 font-medium text-xs sm:text-sm min-w-0">
                <span className="truncate">
                    {job.minPay && job.maxPay ? `\$${(job.minPay / 1000).toFixed(1)}K - \$${(job.maxPay / 1000).toFixed(1)}K` : "Unknown"}
                </span>
            </div>
        </div>
    );
}