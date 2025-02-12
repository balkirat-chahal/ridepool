import RideRequestCard from "./RideRequestCard.jsx";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Requests() {
  const [filters, setFilters] = useState({ from: "", to: "", date: "" });
  const [rideRequests, setRideRequests] = useState([]);

  useEffect(() => {
    console.log("Sending requests get");
    const queryParams = new URLSearchParams(window.location.search);
    setFilters({
      from: queryParams.get("from") || "",
      to: queryParams.get("to") || "",
      date: queryParams.get("date") || "",
    });
  }, []);

  useEffect(() => {
    axios
      .get("/api/requests", { params: filters })
      .then((response) => {
        console.log("Ride requests:", response.data);
        setRideRequests(response.data);
      })
      .catch((error) => console.error("Error fetching ride requests:", error));
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
              key={request.RID || index}
              username={`${request.requester_first_name} ${request.requester_last_name}`}
              profilePic="https://via.placeholder.com/80"
              from={`${request.from_city}, ${request.from_province}, Canada`}
              to={`${request.to_city}, ${request.to_province}, Canada`}
              date={new Date(request.date).toISOString().split("T")[0]}
              time={request.time}
              price={`$${request.price}`}
              riders="1 rider"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
