import { useState, useEffect, useRef } from "react";

import { jobsAPI } from "../api";

type FilterType =
  | { type: "DYNAMIC" }
  | { type: "STATIC"; filterOptions: string[] };

interface FilterProps {
  filterName: string;
  filterType: FilterType;
  applyFilter: (filterName: string, filterValues: string[]) => void;
}

export default function MultiSelectFilter({
  filterName,
  filterType,
  applyFilter,
}: FilterProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<string[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [numFiltersApplied, setNumFiltersApplied] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  useEffect(() => {
    if (filterType.type === "STATIC") {
      setFilterOptions(filterType.filterOptions);
    }
  }, []);

  useEffect(() => {
    const fetchFilterOptionsFromBackend = async (input: string) => {
      if (!input) return;
      if (filterName !== "Industry" && filterName !== "Location") {
        return;
      }
      try {
        const response = await jobsAPI.getBackendQuery(filterName, input);
        if (response.success && response.data) {
          setFilterOptions(response.data.results);
        } else {
          console.log("No filter options for this query");
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
        setFilterOptions([]);
      }
    };
    const timeoutId = setTimeout(
      () => fetchFilterOptionsFromBackend(filterText),
      300
    );
    return () => clearTimeout(timeoutId);
  }, [filterText]);

  const handleFilterSearchInput = (input: string) => {
    setFilterText(input);
  };

  const updateFilterValues = (value: string) => {
    let filterArray = [...filterValues];
    if (filterArray.indexOf(value) != -1) {
      filterArray = filterArray.filter((element) => element != value);
      setFilterValues(filterArray);
    } else {
      filterArray.push(value);
      setFilterValues(filterArray);
    }
  };

  const handleApplyButton = () => {
    applyFilter(filterName, filterValues);
    setNumFiltersApplied(filterValues.length);
    toggleFilter();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
    };

    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOpen]);

  return (
    <div className="w-full h-full relative" ref={dropdownRef}>
      <button
        className="border border-green-800 text-green-800 font-bold rounded-full w-full h-full px-3 py-2 hover:cursor-pointer"
        style={
          numFiltersApplied !== 0
            ? { backgroundColor: "#15803d", color: "white", font: "bold" }
            : {}
        }
        onClick={toggleFilter}
      >
        {numFiltersApplied === 0
          ? filterName
          : `${filterName} (${numFiltersApplied})`}
      </button>

      {filterOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-64 bg-white border border-green-800 rounded-2xl mt-1 p-4 shadow-lg z-10">
          {filterType.type === "DYNAMIC" && (
            <div className="mb-3">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                placeholder={`Search ${filterName.toLowerCase()}...`}
                onChange={(e) => handleFilterSearchInput(e.target.value)}
              />
            </div>
          )}

          <div className="max-h-48 overflow-y-auto">
            {filterOptions.length === 0 ? (
              <div className="text-gray-500 text-sm py-2 text-center">
                {filterType.type === "DYNAMIC" && filterText
                  ? "No results found"
                  : "Start typing to search..."}
              </div>
            ) : (
              filterOptions.map((filterOption) => (
                <div
                  key={filterOption}
                  className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded-lg"
                >
                  <input
                    type="checkbox"
                    value={filterOption}
                    id={filterOption}
                    checked={filterValues.includes(filterOption)}
                    onChange={(e) => updateFilterValues(e.target.value)}
                    className="accent-green-700 mt-0.5 flex-shrink-0"
                  />
                  <label
                    htmlFor={filterOption}
                    className="text-sm text-gray-700 cursor-pointer leading-relaxed flex-1"
                  >
                    {filterOption}
                  </label>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              className="border border-green-800 text-white font-medium bg-green-700 hover:bg-green-800 rounded-lg px-3 py-1.5 w-full transition-colors duration-200 text-xs"
              onClick={() => handleApplyButton()}
            >
              Apply {filterValues.length > 0 && `(${filterValues.length})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
