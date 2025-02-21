import React from 'react';
import { RideBookings } from './RideBookings'; // Import RideBookings component
import { RequestBookings } from './RequestBookings'; // Import RequestBookings component

const Inbox = () => {
  return (
    <div className="p-10 min-h-screen w-full sm:w-8/12 mx-auto">
      {/* Heading for Ride Bookings */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Offers on my Rides
      </h2>

      {/* Render RideBookings Component */}
      <div className="mb-8">
        <RideBookings />
      </div>
      
      {/* Heading for Request Bookings */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Offers on my Requests
      </h2>

      {/* Render RequestBookings Component */}
      <div>
        <RequestBookings />
      </div>
    </div>
  );
};

export default Inbox;