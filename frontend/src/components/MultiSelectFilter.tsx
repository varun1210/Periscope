import { useState, useEffect, useRef } from "react";
import axios from "axios";

type FilterType = {type: 'DYNAMIC'} | {type: 'STATIC', filterOptions: string[]}

interface FilterProps {
  filterName: string,
  filterType: FilterType,
  applyFilter: (filterName: string, filterValues: string[]) => void
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
    if(filterType.type === 'STATIC') { setFilterOptions(filterType.filterOptions) }
  }, [])

  useEffect(() => {
    const fetchFilterOptionsFromBackend = async (input: string) => {
      if(!input) return; 
      // const response = await axios.get(`https://abc.com/response?query=${input}`);
      console.log(input);
      // setFilterOptions(response.data);
    };
    const timeoutId = setTimeout(() => fetchFilterOptionsFromBackend(filterText), 300);
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
        <div className="absolute top-full left-0 w-full bg-white border border-green-800 rounded-2xl mt-1 p-3 shadow-lg z-10">
          {filterType.type === "DYNAMIC" && (
            <div>
              <input
                type="text"
                className="w-full px-3 py-0.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 mb-3"
                placeholder={`${filterName}`}
                onChange={(e) => handleFilterSearchInput(e.target.value)}
              />
            </div>
          )}
          {filterOptions.map((filterOption) => {
            return (
              <div key={filterOption} className="flex items-center gap-2 p-1">
                <input
                  type="checkbox"
                  value={filterOption}
                  id={filterOption}
                  checked={filterValues.includes(filterOption)}
                  onChange={(e) => updateFilterValues(e.target.value)}
                  className="accent-green-700"
                />
                <label htmlFor={filterOption}>{filterOption}</label>
              </div>
            );
          })}
          <button
            className="border border-green-800 text-white font-bold bg-green-700 rounded-full px-3 py-1 mt-2 w-full hover: cursor-pointer"
            onClick={() => handleApplyButton()}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
