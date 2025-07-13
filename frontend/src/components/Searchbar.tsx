import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";

interface SearchbarProps {
  parentSearchText?: string | null;
  updateSearchTerm?: (input: string) => void;
  searchOnEnter: (query: string) => void;
}

export default function Searchbar({
  parentSearchText,
  updateSearchTerm,
  searchOnEnter,
}: SearchbarProps) {
  const [searchTerm, setSearchTerm] = useState(parentSearchText || "");

  useEffect(() => {
    if(parentSearchText) { console.log(`Parent: ${parentSearchText}`) } else {console.log("No parent.")}; 
  }, []);

  const handleSearchTermChange = (input: string) => {
    setSearchTerm(input);
    updateSearchTerm && updateSearchTerm(input);
    console.log("Searching for:", input);
  };

  return (
    <div className="relative w-full">
      <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => handleSearchTermChange(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && searchOnEnter(searchTerm)}
        className="border rounded-full border-green-800 h-10 w-full pl-12 pr-4 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:shadow-lg"
      />
    </div>
  );
}
