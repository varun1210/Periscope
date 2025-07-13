import { useState } from "react";

import { SearchContext } from "./contexts";

import type { Filters } from "../pages/JobsPage";
import type { JobSearchResponse } from "../models/ApiModels";
import type { JobSummary } from "../models/Job";

export default function SearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchResults, setSearchResults] = useState<JobSearchResponse | null>(
    null
  );
  const [fetchedJobs, setFetchedJobs] = useState<JobSummary[] | null>(null);

  const updateSearchContext = (
    searchQuery: string | null,
    filters: Filters | null,
    searchResults: JobSearchResponse | null
  ) => {
    setSearchQuery(searchQuery);
    setFilters(filters);
    setSearchResults(searchResults);
    if (searchResults === null) {
      setFetchedJobs([]);
      return;
    }
    setFetchedJobs(
      searchResults?.jobs?.map((job) => {
        return {
          jobId: job.job_id,
          company: job.company,
          title: job.title,
          location: job.location,
          medianPay: job.median_pay,
          maxPay: job.max_pay,
          minPay: job.min_pay,
          link: job.link,
        };
      })
    );
  };

  const updateJobList = (jobsToAppend: JobSearchResponse) => {
    if (jobsToAppend.jobs.length === 0) {
      return;
    }
    const jobSummaries: JobSummary[] = jobsToAppend.jobs.map((job) => {
      return {
        jobId: job.job_id,
        company: job.company,
        title: job.title,
        location: job.location,
        medianPay: job.median_pay,
        maxPay: job.max_pay,
        minPay: job.min_pay,
        link: job.link,
      };
    });
    setFetchedJobs((currentFetchedJobs) => {
      return [...(currentFetchedJobs ?? []), ...jobSummaries];
    });
  };

  const updatePageNumber = (pageNumber: number) => {
    setPageNumber(pageNumber);
  }

  return (
    <SearchContext.Provider
      value={{
        searchQuery: searchQuery,
        filters: filters,
        pageNumber: pageNumber,
        searchResults: searchResults,
        fetchedJobs: fetchedJobs,
        updateSearchContext: updateSearchContext,
        updateJobList: updateJobList,
        updatePageNumber: updatePageNumber
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
