import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RideInfo = () => {
    const { id } = useParams();
    const [ride, setRide] = useState(null);
    const [driver, setDriver] = useState(null);
    const [vehicle, setVehicle] = useState(null);
    const initialUrl = useRef('');

    const navigate = useNavigate();

    const handleBooking = async () => {
        try {
            const response = await axios.post('/api/ridebookings/new', 
                { rideID: id }, 
                {
                    headers: { 
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            if (response.status === 201) {
                navigate('/bookings'); // Redirect to bookings page
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate("/login", { state: { from: initialUrl.current } });
            } else if (error.response) {
                alert(`Booking failed: ${error.response.data.message}`);
            } else {
                console.error("Booking error:", error);
                alert("Booking failed. Please try again.");
            }
        }
    };

    useEffect(() => {
        initialUrl.current = window.location.pathname + window.location.search;
      }, []);

      useEffect(() => {
        const fetchRideDetails = async () => {
          try {
            const response = await axios.get(`/api/rides/${id}`, {
              //headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
      
            setRide(response.data.ride);
            setDriver(response.data.driver);
            setVehicle(response.data.vehicle);
          } catch (error) {
            if (error.response && error.response.status === 401) {
              navigate("/login", { state: { from: initialUrl.current } });
            } else {
              console.error("Fetch error:", error);
            }
          }
        };
      
        fetchRideDetails();
      }, [id, navigate]);
      

    if (!ride || !driver || !vehicle) {
        return <div className="p-8 text-center">Loading ride details...</div>;
    }

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-10">
            <div className="space-y-6">
                <Typography variant="h4" className="font-bold text-gray-800">Ride Details</Typography>
                <Divider />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <Typography variant="h6" className="font-semibold text-gray-700">Departure</Typography>
                    <Typography className="text-gray-600">{ride.from}</Typography>
                </div>
                <div>
                    <Typography variant="h6" className="font-semibold text-gray-700">Destination</Typography>
                    <Typography className="text-gray-600">{ride.to}</Typography>
                </div>
            </div>

            <div className="flex flex-wrap gap-8 justify-between">
                <div className="flex items-center space-x-2">
                    <EventIcon className="text-gray-500" />
                    <Typography>{new Date(ride.date).toLocaleDateString()}</Typography>
                </div>
                <div className="flex items-center space-x-2">
                    <AccessTimeIcon className="text-gray-500" />
                    <Typography>{formatTime(ride.time)}</Typography>
                </div>
                <div className="flex items-center space-x-2">
                    <PersonIcon className="text-gray-500" />
                    <Typography>{ride.seats} seats available</Typography>
                </div>
            </div>

            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <Typography variant="h6" className="font-semibold text-gray-700">Driver Information</Typography>
                    <Typography>Name: {driver.name}</Typography>
                    <Typography>Email: {driver.email}</Typography>
                </div>
                <div>
                    <Typography variant="h6" className="font-semibold text-gray-700">Vehicle Details</Typography>
                    <Typography>Make: {vehicle.make}</Typography>
                    <Typography>Model: {vehicle.model}</Typography>
                    <Typography>Year: {vehicle.year}</Typography>
                </div>
            </div>

            <div className="text-center">
                <Button
                    onClick={handleBooking}
                    variant="contained"
                    size="large"
                    sx={{
                            backgroundColor: 'rgb(249, 115, 22)', // Equivalent to bg-orange-500
                                '&:hover': {
                    backgroundColor: 'rgb(234, 94, 15)', // Equivalent to hover:bg-orange-600
                    },
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    borderRadius: '1rem',
                    }}
                >
                    Book Now - ${Number(ride.price || 0).toFixed(2)}
                </Button>
            </div>

        </div>
    );
};

export default RideInfo;