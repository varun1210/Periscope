import { useState } from "react";
import { IoSearch } from "react-icons/io5";

import { jobsAPI } from "../api";

interface SearchbarProps {
  updateSearchTerm: (input: string) => void;
}

export default function Searchbar({ updateSearchTerm }: SearchbarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = (input: string) => {
    setSearchTerm(input);
    updateSearchTerm(input);
    console.log("Searching for:", input);
  };

  const performSearch = async (query: string) => {
    console.log("Performing search with query:", query);
  };

  return (
    <div className="relative w-full">
      <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => handleSearchTermChange(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && performSearch(searchTerm)}
        className="border rounded-full border-green-800 h-10 w-full pl-12 pr-4 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:shadow-lg"
      />
    </div>
  );
}
