import { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

import Searchbar from "../components/Searchbar";
import MultiSelectFilter from "../components/MultiSelectFilter";

import type Job from "../models/Job";
import JobCard from "../components/JobCard";
import JobPost from "../components/JobPost";
import { AuthContext, UserContext } from "../utils/contexts";

import jobs from '../components/jobs.ts'

export interface Filters {
  locationFilter: string[],
  experienceFilter: string[],
  industryFilter: string[],
  resumeFilter: string
}

export default function JobsPage() {
  const authState = useContext(AuthContext);
  const { user } = useContext(UserContext);
  // const [jobSearchResults, setJobSearchResults] = useState<Job[]>([]);
  const [jobSearchResults, setJobSearchResults] = useState<Job[]>(jobs);
  const [searchStartIndex, setSearchStartIndex] = useState(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    locationFilter: [],
    experienceFilter: [],
    industryFilter: [],
    resumeFilter: "",
  });
  const [resumeFilterOptions, setResumeFilterOptions] = useState<string[] | null>([]);

  useEffect(() => {
    if (!user) return;
    setResumeFilterOptions(user?.resumePaths);
  }, [user]);

  const applyFilter = (filterType: string, filterValues: string[]) => {
    setFilters((currentFilters) => {
      return { ...currentFilters, [filterType]: filterValues };
    });
  };

  const performSearch = async () => {
    // post request should query 20 results
    setSearchStartIndex(0);
    // const response = await axios.get(
    //   `http://localhost:8080/api/jobsearch?start=0?${filters}`
    // );
    // setJobSearchResults(response.data);
    setJobSearchResults(jobs);
    setSearchStartIndex((currSearchIndex) => currSearchIndex + 20);
    // setSelectedJob(response.data[0] || null);
    setSelectedJob(jobs[0]);
    setShowJobDetails(false);
  };

  const loadMoreResults = async () => {
    // const response = await axios.get(
    //   `http://localhost:8080/api/jobsearch?start=${searchStartIndex}`
    // );
    // const responseJobs = response.data;
    // setJobSearchResults((currentJobs) => {
      // const updatedJobs = [...currentJobs].concat(responseJobs);
      // return updatedJobs;
    // });
    setSearchStartIndex(
      (currentSearchStartIndex) => currentSearchStartIndex + 20
    );
  };

  const changeSelectedJob = (job: Job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleBackToList = () => {
    setShowJobDetails(false);
  };

  if (!authState.loggedIn) return <Navigate to="/login" />;
  if (authState.loggedIn && !user) return <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-50">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          {/* Mobile Layout */}
          <div className="block lg:hidden space-y-4">
            <div>
              <Searchbar />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MultiSelectFilter
                filterName="Location"
                filterType={{ type: "DYNAMIC" }}
                applyFilter={applyFilter}
              />
              <MultiSelectFilter
                filterName="Experience"
                filterType={{
                  type: "STATIC",
                  filterOptions: ["Entry-Level", "Mid-Level", "Senior"],
                }}
                applyFilter={applyFilter}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MultiSelectFilter
                filterName="Industry"
                filterType={{ type: "DYNAMIC" }}
                applyFilter={applyFilter}
              />
              <select
                className={`border rounded-full w-full px-3 py-2 focus:outline-none appearance-none text-center text-sm ${
                  filters.resumeFilter !== ""
                    ? "bg-[#15803d] text-white border-[#15803d] font-bold"
                    : "border-green-800 text-green-900 font-bold bg-white"
                }`}
                value={filters.resumeFilter}
                onChange={(e) => applyFilter("resumeFilter", [e.target.value])}
              >
                <option value="" disabled>
                  Resume
                </option>
                {resumeFilterOptions?.map((resumePath) => (
                  <option key={resumePath} value={resumePath}>
                    {resumePath.split("/").pop()?.replace(".pdf", "") ||
                      resumePath}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center">
              <button
                className="bg-green-800 text-white font-bold px-8 py-2 rounded-full hover:bg-green-700 hover:cursor-pointer transition-colors w-full sm:w-auto"
                onClick={() => performSearch()}
              >
                Search
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-[3fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center">
            <div>
              <Searchbar />
            </div>
            <div>
              <MultiSelectFilter
                filterName="Location"
                filterType={{ type: "DYNAMIC" }}
                applyFilter={applyFilter}
              />
            </div>
            <div>
              <MultiSelectFilter
                filterName="Experience"
                filterType={{
                  type: "STATIC",
                  filterOptions: ["Entry-Level", "Mid-Level", "Senior"],
                }}
                applyFilter={applyFilter}
              />
            </div>
            <div>
              <MultiSelectFilter
                filterName="Industry"
                filterType={{ type: "DYNAMIC" }}
                applyFilter={applyFilter}
              />
            </div>
            <div>
              <select
                className={`border rounded-full w-full height-full px-3 py-2 focus:outline-none appearance-none text-center ${
                  filters.resumeFilter !== ""
                    ? "bg-[#15803d] text-white border-[#15803d] font-bold"
                    : "border-green-800 text-green-900 font-bold bg-white"
                }`}
                value={filters.resumeFilter}
                onChange={(e) => applyFilter("resumeFilter", [e.target.value])}
              >
                <option value="" disabled>
                  Resume
                </option>
                {resumeFilterOptions?.map((resumePath) => (
                  <option key={resumePath} value={resumePath}>
                    {resumePath.split("/").pop()?.replace(".pdf", "") ||
                      resumePath}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                className="bg-green-800 text-white font-bold px-6 py-2 rounded-full hover:bg-green-700 hover:cursor-pointer transition-colors whitespace-nowrap"
                onClick={() => performSearch()}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {jobSearchResults.length === 0 ? (
            <div className="flex-1 flex justify-center items-center min-h-96">
              <h1 className="text-xl text-gray-500 text-center">
                Search for something to get started!
              </h1>
            </div>
          ) : (
            <>
              {/* Mobile: Job List or Job Detail */}
              <div className="block lg:hidden">
                {!showJobDetails ? (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      {jobSearchResults.length} Jobs Found
                    </h2>
                    <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                      {jobSearchResults.map((job) => (
                        <JobCard
                          key={job.jobId}
                          {...job}
                          onClick={() => changeSelectedJob(job)}
                          className={
                            selectedJob?.jobId === job.jobId
                              ? "ring-2 ring-green-500 border-green-500 bg-green-50"
                              : ""
                          }
                        />
                      ))}
                      <div className="flex flex-row justify-center items-center py-4">
                        <button
                          className="text-green-800 text-sm"
                          onClick={() => loadMoreResults()}
                        >
                          Load more
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleBackToList}
                        className="text-green-800 hover:text-green-700 text-sm font-medium"
                      >
                        ← Back to Jobs
                      </button>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Job Details
                      </h2>
                    </div>
                    <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
                      {selectedJob && <JobPost {...selectedJob} />}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop: Side-by-side Layout */}
              <div className="hidden lg:flex lg:flex-row lg:gap-3 w-full">
                {/* Job Cards Column */}
                <div className="flex-1 flex flex-col h-[calc(100vh-180px)] bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">
                    {jobSearchResults.length} Jobs Found
                  </h2>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    {jobSearchResults.map((job) => (
                      <JobCard
                        key={job.jobId}
                        {...job}
                        onClick={() => changeSelectedJob(job)}
                        className={
                          selectedJob?.jobId === job.jobId
                            ? "ring-2 ring-green-500 border-green-500 bg-green-50"
                            : ""
                        }
                      />
                    ))}
                    <div className="flex flex-row justify-center items-center py-4">
                      <button
                        className="text-green-800 text-sm"
                        onClick={() => loadMoreResults()}
                      >
                        Load more
                      </button>
                    </div>
                  </div>
                </div>

                {/* Spacer */}
                <div className="w-3"></div>

                {/* Job Post Detail Column */}
                <div className="flex-2 flex flex-col h-[calc(100vh-180px)] bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">
                    Job Details
                  </h2>
                  <div className="flex-1 overflow-y-auto">
                    {selectedJob && <JobPost {...selectedJob} />}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}