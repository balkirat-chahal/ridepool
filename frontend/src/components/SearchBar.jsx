import { useState } from "react";
import { LocationOn, SwapHoriz, CalendarToday } from "@mui/icons-material";

export default function SearchBar() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("Edmonton, AB, Canada");
  const [date, setDate] = useState("");

  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-full p-2 shadow-md w-full max-w-3xl gap-2 sm:gap-4 items-center">
      {/* From Input */}
      <div className="flex items-center bg-gray-200 px-4 py-2 rounded-lg w-full sm:w-auto">
        <LocationOn className="text-black" />
        <input
          type="text"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
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
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="bg-transparent w-full focus:outline-none px-2"
        />
      </div>
      
      {/* Date Input */}
      <div className="flex items-center bg-gray-200 px-4 py-2 rounded-lg w-full sm:w-auto">
        <CalendarToday className="text-black" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-transparent w-full focus:outline-none px-2"
        />
      </div>
      
      {/* Search Button */}
      <button className="bg-black text-white px-6 py-2 rounded-lg font-semibold w-full sm:w-auto">
        Search
      </button>
    </div>
  );
}
