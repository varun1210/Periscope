import { FaMapMarkerAlt } from "react-icons/fa";

import type Job from "../models/Job";

export default function JobTile(job: Job) {
    return (
        <div className="grid gap-2 p-2 items-center h-12" style={{ gridTemplateColumns: '1.5fr 2.5fr 1fr 1fr' }}>
            <div className="flex font-medium justify-start items-center text-sm truncate">
                <b>{job.company}</b>
            </div>
            <div className="flex font-normal justify-start items-center text-sm truncate">{job.title}</div>
            <div className="flex items-center gap-1 text-sm truncate">
                <FaMapMarkerAlt className="text-gray-500 text-xs flex-shrink-0" />
                <span className="truncate">{job.location}</span>
            </div>
            <div className="flex justify-end items-center text-green-600 font-medium text-sm truncate">${job.minPay} - ${job.maxPay}</div>
        </div>
    );
}