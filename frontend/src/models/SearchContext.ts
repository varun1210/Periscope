import type { Filters } from "../pages/JobsPage";
import type { JobSummary } from "./Job";

export type SearchContextType = {
  searchQuery: string | null;
  filters: Filters | null;
  results: JobSummary[] | null;
  totalResults: number | null;
  updateSearchContext: (
    query: string | null,
    filters: Filters | null,
    results: JobSummary[] | null,
    totalResults: number | null
  ) => void;
};
