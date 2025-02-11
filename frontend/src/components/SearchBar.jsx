// SearchBar.js
import { useState, useEffect } from "react";
import { LocationOn, SwapHoriz, CalendarToday } from "@mui/icons-material";

export default function SearchBar({ currentFilters, onFiltersChange }) {
  const [localFilters, setLocalFilters] = useState(currentFilters);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleSearch = () => {
    onFiltersChange(localFilters);
  };

  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-lg p-5 shadow-md w-full max-w-3xl gap-2 sm:gap-4 items-center mx-auto">
      {/* From Input */}
      <div className="flex items-center bg-gray-200 px-4 py-2 rounded-lg w-full sm:w-auto">
        <LocationOn className="text-black" />
        <input
          type="text"
          placeholder="From"
          value={localFilters.from}
          onChange={(e) => setLocalFilters(prev => ({ ...prev, from: e.target.value }))}
          className="bg-transparent w-full focus:outline-none px-2"
        />
      </div>
      
      {/* Swap Icon */}
      <SwapHoriz className="text-gray-500 hidden sm:block" />
      
      {/* To Input */}
      <div className="flex items-center bg-gray-200 px-4 py-2 rounded-lg w-full sm:w-auto">
        <LocationOn className="text-black" />
        <input
          type="text"
          placeholder="To"
          value={localFilters.to}
          onChange={(e) => setLocalFilters(prev => ({ ...prev, to: e.target.value }))}
          className="bg-transparent w-full focus:outline-none px-2"
        />
      </div>
      
      {/* Date Input */}
      <div className="flex items-center bg-gray-200 px-4 py-2 rounded-lg w-full sm:w-auto">
        <CalendarToday className="text-black" />
        <input
          type="date"
          value={localFilters.date}
          onChange={(e) => setLocalFilters(prev => ({ ...prev, date: e.target.value }))}
          className="bg-transparent w-full focus:outline-none px-2"
        />
      </div>
      
      {/* Search Button */}
      <button 
        className="bg-black text-white px-6 py-2 rounded-lg font-semibold w-full sm:w-auto hover:cursor-pointer"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}