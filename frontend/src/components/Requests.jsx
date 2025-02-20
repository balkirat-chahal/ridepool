import RideRequestCard from "./RideRequestCard.jsx";
import SearchBar from "./SearchBar";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Requests() {
  const [filters, setFilters] = useState({ from: "", to: "", date: "" });
  const [rideRequests, setRideRequests] = useState([]);
  const initialUrl = useRef('');

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Sending requests get");
    initialUrl.current = window.location.pathname + window.location.search;
    const queryParams = new URLSearchParams(window.location.search);
    setFilters({
      from: queryParams.get("from") || "",
      to: queryParams.get("to") || "",
      date: queryParams.get("date") || "",
    });
  }, []);

  useEffect(() => {
    axios.get("/api/requests", { params: filters })
      .then(response => {
        console.log("Ride requests:", response.data);
        setRideRequests(response.data);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          // Redirect to login page with the 'from' state
          // const url = window.location.pathname + window.location.search;
          console.log("Requests URL: ", initialUrl)
          navigate('/login', { state: { from: initialUrl.current } });
        } else {
          console.error("Error fetching ride offers:", error);
        }
      });
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
              id={request.RID}
              username={`${request.requester_first_name} ${request.requester_last_name}`}
              profilePic=""
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
