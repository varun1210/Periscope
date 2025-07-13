import { useState, useContext, useEffect } from "react";

import { jobsAPI } from "../api.ts";

import Searchbar from "../components/Searchbar";
import MultiSelectFilter from "../components/MultiSelectFilter";

import performQuickSearch from "../utils/UtilFunctions.ts";

import type { Job, JobSummary } from "../models/Job";
import JobCard from "../components/JobCard";
import JobPost from "../components/JobPost";
import { UserContext, SearchContext } from "../utils/contexts";

export type Filters = {
  locationFilter?: string[];
  experienceFilter?: string[];
  industryFilter?: string[];
  resumeFilter?: string;
};

export default function JobsPage() {
  const { user } = useContext(UserContext);
  const searchContext = useContext(SearchContext);
  const [searchTerm, setSearchTerm] = useState(searchContext.searchQuery || "");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    locationFilter: [],
    experienceFilter: [],
    industryFilter: [],
    resumeFilter: "",
  });
  const [resumeFilterOptions, setResumeFilterOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    setResumeFilterOptions(user?.resumePaths || []);
  }, [user]);

  useEffect(() => {
    const updateFirstSelectedJob = async () => {
      try {
        if (!searchContext.searchResults) {
          return;
        }
        if (searchContext.searchResults.total === 0) {
          setSelectedJob(null);
          return;
        }
        const firstJobDetails = await jobsAPI.getFullJobDetails(
          searchContext.searchResults.jobs[0].job_id
        );

        if (!firstJobDetails.success || !firstJobDetails.data) {
          console.error(
            "Error fetching first job details:",
            firstJobDetails.error
          );
          setSelectedJob(null);
          return;
        }
        setSelectedJob({
          jobId: firstJobDetails.data.job_id,
          company: firstJobDetails.data.company,
          title: firstJobDetails.data.title,
          location: firstJobDetails.data.location,
          jobDescription: firstJobDetails.data.job_description,
          medianPay: firstJobDetails.data.median_pay,
          minPay: firstJobDetails.data.min_pay,
          maxPay: firstJobDetails.data.max_pay,
          industry: firstJobDetails.data.industry,
          experience: firstJobDetails.data.experience,
          link: firstJobDetails.data.link,
        });
      } catch (error) {
        console.log("Error loading first job", error);
      }
    };
    updateFirstSelectedJob();
  }, [searchContext.searchResults?.jobs[0]]);

  const applyFilter = (filterName: string, filterValues: string[]) => {
    setFilters((currentFilters) => {
      const updateFilterValues = { ...currentFilters };
      if (filterName === "Location") {
        updateFilterValues.locationFilter = filterValues;
      } else if (filterName === "Experience") {
        updateFilterValues.experienceFilter = filterValues;
      } else if (filterName === "Industry") {
        updateFilterValues.industryFilter = filterValues;
      }
      return updateFilterValues;
    });
  };

  const handleQuickSearch = async (searchQuery: string) => {
    try {
      const searchResults = await performQuickSearch(searchQuery);
      if (searchResults) {
        searchContext.updateSearchContext(searchQuery, null, searchResults);
        searchContext.updatePageNumber(2);
      }
    } catch (error) {
      console.error("Search failed:", error);
      // Optionally, you can show an error message to the user here
    }
  };

  const applyResumeFilter = (resumePath: string) => {
    setFilters((currentFilters) => {
      return { ...currentFilters, resumeFilter: resumePath };
    });
  };

  const handleSearchTermChange = (input: string) => {
    setSearchTerm(input);
  };

  const performSearch = async () => {
    setIsLoading(true);

    try {
      const response = await jobsAPI.searchJobs(searchTerm, filters, 1, 20);

      if (!response.success || !response.data) {
        console.error("Error fetching jobs:", response.error);
        searchContext.updateSearchContext(searchTerm, filters, null);
        setSelectedJob(null);
        return;
      }

      if (response.data.total === 0) {
        searchContext.updateSearchContext(searchTerm, filters, response.data);
        return;
      }

      console.log(response.data);

      // Load first job details
      const firstJobDetails = await jobsAPI.getFullJobDetails(
        response.data.jobs[0].job_id
      );

      if (!firstJobDetails.success || !firstJobDetails.data) {
        console.error(
          "Error fetching first job details:",
          firstJobDetails.error
        );
        setSelectedJob(null);
        return;
      }

      searchContext.updateSearchContext(searchTerm, filters, response.data);
      searchContext.updatePageNumber(2);
      // setPageNumber(2);

      setSelectedJob({
        jobId: firstJobDetails.data.job_id,
        title: firstJobDetails.data.title,
        company: firstJobDetails.data.company,
        location: firstJobDetails.data.location,
        jobDescription:
          firstJobDetails.data.job_description || "Job details unavailable",
        medianPay: firstJobDetails.data.median_pay,
        minPay: firstJobDetails.data.min_pay,
        maxPay: firstJobDetails.data.max_pay,
        industry: firstJobDetails.data.industry,
        experience: firstJobDetails.data.experience,
        link: firstJobDetails.data.link,
      });
      setShowJobDetails(false);
    } catch (error) {
      console.error("Error performing search:", error);
      // setJobSearchResults([]);
      setSelectedJob(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreResults = async () => {
    // console.log(pageNumber);
    if(!searchContext.searchQuery) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await jobsAPI.searchJobs(
        searchContext.searchQuery,
        searchContext.filters || undefined,
        searchContext.pageNumber,
        20
      );

      if (!response.success || !response.data) {
        console.error("Error loading more results:", response.error);
        return;
      }
      searchContext.updateJobList(response.data);
      searchContext.updatePageNumber(searchContext.pageNumber + 1);
      // setPageNumber((currentPageNumber) => currentPageNumber + 1);
    } catch (error) {
      console.error("Error loading more results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeSelectedJob = async (job: JobSummary) => {
    setIsLoading(true);
    try {
      const response = await jobsAPI.getFullJobDetails(job.jobId);

      if (!response.success || !response.data) {
        console.error("Error fetching job details:", response.error);
        setSelectedJob(null);
        return;
      }

      setSelectedJob({
        jobId: response.data.job_id,
        title: response.data.title,
        company: response.data.company,
        location: response.data.location,
        jobDescription:
          response.data.job_description || "Job details unavailable",
        medianPay: response.data.median_pay,
        minPay: response.data.min_pay,
        maxPay: response.data.max_pay,
        industry: response.data.industry,
        experience: response.data.experience,
        link: response.data.link,
      });
      setShowJobDetails(true);
    } catch (error) {
      console.error("Error fetching job details:", error);
      setSelectedJob(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToList = () => {
    setShowJobDetails(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          {/* Mobile Layout */}
          <div className="block lg:hidden space-y-4">
            <div>
              <Searchbar
                parentSearchText={searchContext.searchQuery}
                updateSearchTerm={handleSearchTermChange}
                searchOnEnter={handleQuickSearch}
              />
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
                onChange={(e) => applyResumeFilter(e.target.value)}
                disabled={isLoading}
              >
                <option value="" disabled>
                  Resume
                </option>
                {resumeFilterOptions.map((resumePath) => (
                  <option key={resumePath} value={resumePath}>
                    {resumePath.split("/").pop()?.replace(".pdf", "") ||
                      resumePath}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center">
              <button
                className="bg-green-800 text-white font-bold px-8 py-2 rounded-full hover:bg-green-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                onClick={performSearch}
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-[3fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center">
            <div>
              <Searchbar
                parentSearchText={searchContext.searchQuery}
                updateSearchTerm={handleSearchTermChange}
                searchOnEnter={handleQuickSearch}
              />
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
                className={`border rounded-full w-full px-3 py-2 focus:outline-none appearance-none text-center ${
                  filters.resumeFilter !== ""
                    ? "bg-[#15803d] text-white border-[#15803d] font-bold"
                    : "border-green-800 text-green-900 font-bold bg-white"
                }`}
                value={filters.resumeFilter}
                onChange={(e) => applyResumeFilter(e.target.value)}
                disabled={isLoading}
              >
                <option value="" disabled>
                  Resume
                </option>
                {resumeFilterOptions.map((resumePath) => (
                  <option key={resumePath} value={resumePath}>
                    {resumePath.split("/").pop()?.replace(".pdf", "") ||
                      resumePath}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                className="bg-green-800 text-white font-bold px-6 py-2 rounded-full hover:bg-green-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                onClick={performSearch}
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {searchContext.searchResults === null ? (
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
                      {searchContext.searchResults.total} Jobs Found
                    </h2>
                    {searchContext.searchResults.total === 0 ? (
                      <div className="text-lg font-medium text-gray-900 mb-2">
                        No jobs found that match your query!
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                        {searchContext.fetchedJobs?.map((job) => (
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
                            className="text-green-800 text-sm hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={loadMoreResults}
                            disabled={isLoading}
                          >
                            {isLoading ? "Loading..." : "Load more"}
                          </button>
                        </div>
                      </div>
                    )}
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
              <div className="hidden lg:flex lg:flex-row lg:gap-6 w-full">
                {/* Job Cards Column */}
                <div className="flex-1 flex flex-col h-[calc(100vh-180px)] bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">
                    {searchContext.searchResults.total} Jobs Found
                  </h2>
                  {searchContext.searchResults.total === 0 ? (
                    <div className="text-xl font-semibold text-gray-900 mb-3">
                      No jobs found that match your query!
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                      {searchContext.fetchedJobs?.map((job) => (
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
                          className="text-green-800 text-sm hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={loadMoreResults}
                          disabled={isLoading}
                        >
                          {isLoading ? "Loading..." : "Load more"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Job Post Detail Column */}
                <div className="flex-[2] flex flex-col h-[calc(100vh-180px)] bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">
                    Job Details
                  </h2>
                  <div className="flex-1 overflow-y-auto">
                    {selectedJob ? (
                      <JobPost {...selectedJob} />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Select a job to view details
                      </div>
                    )}
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
