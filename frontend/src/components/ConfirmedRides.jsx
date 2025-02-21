import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConfirmedRideCard from "./ConfirmedRideCard";

function ConfirmedRides() {
  const [drivingRides, setDrivingRides] = useState([]);
  const [ridingRides, setRidingRides] = useState([]);
  const navigate = useNavigate();
  const initialUrl = useRef("");

  useEffect(() => {
    console.log("Fetching ride bookings");
    initialUrl.current = window.location.pathname + window.location.search;

    axios.get("/api/bookings")
      .then(response => {
        console.log(response.data);
        setDrivingRides(response.data.driving);
        setRidingRides(response.data.riding);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          navigate('/login', { state: { from: initialUrl.current } });
        } else {
          console.error("Error fetching ride bookings:", error);
        }
      });
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-5xl mx-auto">
      {/* Driving Section */}
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">Driving</h2>
        {drivingRides.length > 0 ? (
          drivingRides.map(ride => (
            <ConfirmedRideCard
              key={ride.id}
              username={ride.otherUsername}
              profilePic=""
              fromDate={formatDate(ride.date)}
              fromTime={ride.time.slice(0, 5)}
              fromCity={ride.fromCity}
              toCity={ride.toCity}
              price={ride.price}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 text-lg">No driving confirmations yet...</div>
        )}
      </div>
      
      {/* Riding Section */}
      <div className="w-full mt-6">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">Riding</h2>
        {ridingRides.length > 0 ? (
          ridingRides.map(ride => (
            <ConfirmedRideCard
              key={ride.id}
              username={ride.otherUsername}
              profilePic=""
              fromDate={formatDate(ride.date)}
              fromTime={ride.time.slice(0, 5)}
              fromCity={ride.fromCity}
              toCity={ride.toCity}
              price={ride.price}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 text-lg">No riding confirmations yet...</div>
        )}
      </div>
    </div>
  );
}

export { ConfirmedRides };