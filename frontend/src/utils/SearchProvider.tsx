import { useState } from "react";

import { SearchContext } from "./contexts";

import type { Filters } from "../pages/JobsPage";
import type { JobSummary } from "../models/Job";

export default function SearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [results, setResults] = useState<JobSummary[] | null>(null);
  const [totalResults, setTotalResults] = useState<number | null>(null);

  const updateSearchContext = (
    query: string | null,
    filters: Filters | null,
    results: JobSummary[] | null,
    totalResults: number | null
  ) => {
    setSearchQuery(query);
    setFilters(filters);
    setResults(results);
    setTotalResults(totalResults);
  };
  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        filters,
        results,
        totalResults,
        updateSearchContext,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
