import RideBookingOfferCard from "./RideBookingOfferCard";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RideBookings() {
  // This shows the offers from riders on the rides that the user has posted
  const [rideBookings, setRideBookings] = useState([]);
  const navigate = useNavigate();
  const initialUrl = useRef('');

  useEffect(() => {
    console.log("Fetching ride bookings");
    initialUrl.current = window.location.pathname + window.location.search;
    axios.get("/api/ridebookings")
      .then(response => {
        console.log(response.data);
        setRideBookings(response.data.bookings);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          console.log("Redirecting to login", initialUrl.current);
          navigate('/login', { state: { from: initialUrl.current } });
        } else {
          console.error("Error fetching ride bookings:", error);
        }
      });
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
  <div className="w-full max-w-4xl flex flex-col justify-center">
    {rideBookings.length > 0 ? (
      rideBookings.map(booking => (
        <RideBookingOfferCard
          key={booking.id}
          id={booking.id}
          username={booking.username}
          profilePic={""}
          fromDate={booking.fromDate}
          fromTime={booking.fromTime}
          fromCity={booking.fromCity}
          toDate={booking.toDate}
          toTime={booking.toTime}
          toCity={booking.toCity}
          price={booking.price}
          seatsLeft={booking.seatsLeft}
          status={booking.status}
        />
      ))
    ) : (
      <div className="text-center text-gray-500 text-lg">
        No offers on your rides yet...
      </div>
    )}
  </div>
</div>
  );
}

export { RideBookings };