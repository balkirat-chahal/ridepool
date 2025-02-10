import RideRequestCard from "./RideRequestCard.jsx";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
import axios from "axios";

let rideRequests = [
  [
    "Mike",
    "https://via.placeholder.com/80",
    "Vancouver, BC, Canada",
    "Seattle, WA, USA",
    "2025-03-01",
    "9:00 AM",
    "$40",
    "2 riders",
  ],
  [
    "Emma",
    "https://via.placeholder.com/80",
    "Toronto, ON, Canada",
    "Montreal, QC, Canada",
    "2025-03-05",
    "2:00 PM",
    "$35",
    "3 riders",
  ],
];

export default function Requests() {
    const [filters, setFilters] = useState({ from: '', to: '', date: '' });

    useEffect(() => {
      console.log("Sending requests get");
      const queryParams = new URLSearchParams(window.location.search);
      setFilters({
        from: queryParams.get('from') || '',
        to: queryParams.get('to') || '',
        date: queryParams.get('date') || ''
      });
    }, []);
  
    useEffect(() => {
      axios.get("/api/requests", { params: filters })
        .then(response => console.log("Ride offers:", response.data))
        .catch(error => console.error("Error fetching ride offers:", error));
    }, [filters]);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-4xl mb-6">
        <SearchBar currentFilters={filters} onFiltersChange={setFilters} />
      </div>

      <div className="w-full max-w-4xl flex flex-col justify-center">
        <div className="col-span-1 md:col-span-2 justify-center items-center">
          {rideRequests.map((request, index) => (
            <RideRequestCard
              key={index}
              username={request[0]}
              profilePic={request[1]}
              from={request[2]}
              to={request[3]}
              date={request[4]}
              time={request[5]}
              price={request[6]}
              riders={request[7]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}