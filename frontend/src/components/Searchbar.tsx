import { useState } from "react";
import { IoSearch } from "react-icons/io5";

export default function Searchbar() {
  const [searchTerm, setSearchTerm] = useState('');

  const updateSearchTerm = (input: string) => {
    setSearchTerm(input);
    // Add any additional search logic here
    console.log('Searching for:', input);
  };

  return (
    <div className="relative w-full">
      <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
      <input 
        type="text" 
        placeholder="Search..." 
        value={searchTerm}
        onChange={(e) => updateSearchTerm(e.target.value)}
        className="border rounded-full border-green-800 h-10 w-full pl-12 pr-4 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:shadow-lg"
      />
    </div>
  );
}