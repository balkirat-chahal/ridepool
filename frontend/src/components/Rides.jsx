import RideOfferCard from "./RideOfferCard";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
import axios from "axios";

let rideOffers = [
  [
    "Elliot",
    "https://via.placeholder.com/80",
    "Edmonton, AB, Canada",
    "Summerside, AB, Canada",
    "2025-02-01",
    "5:15 PM",
    "2025-02-01",
    "8:30 PM",
    "https://via.placeholder.com/80",
    "$5",
    "3 seats left",
  ],
  [
    "Sarah",
    "https://via.placeholder.com/80",
    "Calgary, AB, Canada",
    "Banff, AB, Canada",
    "2025-02-02",
    "10:00 AM",
    "2025-02-02",
    "12:30 PM",
    "https://via.placeholder.com/80",
    "$10",
    "2 seats left",
  ],
];

export default function Rides() {
  // State for search parameters
  const [type, setType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');

  // Parse URL parameters when the component mounts
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    // Set type (always present in the URL)
    const urlType = queryParams.get('type');
    if (urlType) {
      setType(urlType);
    }

    // Set from (optional)
    const urlFrom = queryParams.get('from');
    if (urlFrom) {
      setFrom(urlFrom);
    }

    // Set to (optional)
    const urlTo = queryParams.get('to');
    if (urlTo) {
      setTo(urlTo);
    }

    // Set date (optional)
    const urlDate = queryParams.get('date');
    if (urlDate) {
      setDate(urlDate);
    }
  }, []);

  // Fetch ride offers based on the search parameters 
  useEffect(() => {
    console.log("hello");
    if (type) {
      axios.get("/api", { params: { type, from, to, date } })
        .then((response) => {
          console.log("Ride offers:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching ride offers:", error);
        });
    }
  }, [type, from, to, date]);

  return (
    <div className="flex flex-col items-center p-4">
      {/* Search Bar */}
      <div className="w-full max-w-4xl mb-6">
      <SearchBar
          type={type}
          setType={setType}
          from={from}
          setFrom={setFrom}
          to={to}
          setTo={setTo}
          date={date}
          setDate={setDate}
        />
      </div>

      {/* Ride Offers List */}
      <div className="w-full max-w-4xl flex flex-col justify-center">
        <div className="col-span-1 md:col-span-2 justify-center items-center">
          {rideOffers.map((offer, index) => (
            <RideOfferCard
              key={index}
              username={offer[0]}
              profilePicUrl={offer[1]}
              fromCity={offer[2]}
              toCity={offer[3]}
              fromDate={offer[4]}
              fromTime={offer[5]}
              toDate={offer[6]}
              toTime={offer[7]}
              carPicUrl={offer[8]}
              price={offer[9]}
              seatsLeft={offer[10]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
