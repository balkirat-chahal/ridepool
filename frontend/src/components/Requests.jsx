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
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlFrom = queryParams.get('from');
    const urlTo = queryParams.get('to');
    const urlDate = queryParams.get('date');

    if (urlFrom) setFrom(urlFrom);
    if (urlTo) setTo(urlTo);
    if (urlDate) setDate(urlDate);
  }, []);

  useEffect(() => {
    axios.get("/api", { params: { from, to, date } })
      .then(response => console.log("Ride requests:", response.data))
      .catch(error => console.error("Error fetching ride requests:", error));
  }, [from, to, date]);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-4xl mb-6">
        <SearchBar
          from={from}
          setFrom={setFrom}
          to={to}
          setTo={setTo}
          date={date}
          setDate={setDate}
        />
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