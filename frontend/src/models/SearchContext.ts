import type { Filters } from "../pages/JobsPage";
import type { JobSearchResponse } from "./ApiModels";
import type { JobSummary } from "./Job";

export type SearchContextType = {
  searchQuery: string | null;
  filters: Filters | null;
  pageNumber: number;
  searchResults: JobSearchResponse | null;
  fetchedJobs: JobSummary[] | null;

  updateSearchContext: (
    searchQuery: string | null,
    filters: Filters | null,
    searchResults: JobSearchResponse | null,
  ) => void;

  updateJobList: (
    jobsToAppend: JobSearchResponse
  ) => void;

  updatePageNumber: (pageNumber: number) => void;
};
