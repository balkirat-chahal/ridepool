import RequestBookingCard from "./RequestBookingCard";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RequestBookings() {
    // This shows the offers the user has from drivers on the requests the user has posted
    const [requestBookings, setRequestBookings] = useState([]);
    const navigate = useNavigate();
    const initialUrl = useRef('');
  
    useEffect(() => {
      console.log("Fetching request bookings");
      initialUrl.current = window.location.pathname + window.location.search;
      axios.get("/api/requestbookings")
        .then(response => {
          console.log("Request bookings:", response.data);
          setRequestBookings(response.data.requestBookings);
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            console.log("Redirecting to login", initialUrl.current);
            navigate('/login', { state: { from: initialUrl.current } });
          } else {
            console.error("Error fetching request bookings:", error);
          }
        });
    }, []);
  
    return (
        <div className="flex flex-col items-center p-4">
        <div className="w-full max-w-4xl flex flex-col justify-center">
          {requestBookings.length > 0 ? (
            requestBookings.map(request => (
              <RequestBookingCard
                key={request.id}
                id={request.id}
                username={request.username}
                profilePic={""}
                from={request.fromCity}
                to={request.toCity}
                date={request.date}
                time={request.time}
                price={request.price}
                riders={request.riders}
                status={request.status}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 text-lg">
              No offers on your requests yet...
            </div>
          )}
        </div>
      </div>
    );
  }
  
  export { RequestBookings };
  