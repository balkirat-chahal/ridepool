import RideOfferCard from "./RideOfferCard";
import SearchBar from "./SearchBar";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Rides() {
  const [filters, setFilters] = useState({ from: '', to: '', date: '' });
  const [rideOffers, setRideOffers] = useState([]);
  const initialUrl = useRef('');

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Sending rides get");
    initialUrl.current = window.location.pathname + window.location.search;
    const queryParams = new URLSearchParams(window.location.search);
    setFilters({
      from: queryParams.get('from') || '',
      to: queryParams.get('to') || '',
      date: queryParams.get('date') || ''
    });
  }, []);

  useEffect(() => {
    axios.get("/api/rides", { params: filters })
      .then(response => {
        console.log("Ride offers:", response.data);
        setRideOffers(response.data);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          // Redirect to login page with the 'from' state
          // const url = window.location.pathname + window.location.search;
          console.log("Rides URL: ", initialUrl)
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
          {rideOffers.map((offer, index) => (
            <RideOfferCard
              key={offer.TID || index}
              id={offer.TID}
              username={`${offer.driver_first_name} ${offer.driver_last_name}` || "Unknown Driver"}
              profilePic="https://via.placeholder.com/80"
              fromCity={`${offer.from_city}, ${offer.from_province}, Canada`}
              toCity={`${offer.to_city}, ${offer.to_province}, Canada`}
              fromDate={new Date(offer.date).toISOString().split('T')[0]}
              fromTime={offer.time}
              toDate={new Date(offer.date).toISOString().split('T')[0]}
              toTime={offer.time}
              carPic="https://via.placeholder.com/80"
              price={`$${offer.price}`}
              seatsLeft={`${offer.seats} seats left`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
