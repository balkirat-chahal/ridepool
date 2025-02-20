import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequestInfo = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [user, setUser] = useState(null);
  const initialUrl = useRef('');

  const navigate = useNavigate();

  const handleOffer = async () => {
    try {
        const response = await axios.post('/api/requestbookings/new', 
            { requestID: id }, 
            {
                headers: { 
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 201) {
            navigate('/bookings'); // Redirect to offers page
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            navigate("/login", { state: { from: initialUrl.current } });
        } else if (error.response) {
            alert(`Offer failed: ${error.response.data.message}`);
        } else {
            console.error("Offer error:", error);
            alert("Offer failed. Please try again.");
        }
    }
};


  useEffect(() => {
    initialUrl.current = window.location.pathname + window.location.search;
  }, []);

useEffect(() => {
  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(`/api/requests/${id}`, {
        // headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      setRequest(response.data.request);
      setUser(response.data.user);
    } catch (error) {
      // Check if the error response is available and if status is 401
      if (error.response && error.response.status === 401) {
        navigate("/login", { state: { from: initialUrl.current } });
      } else {
        console.error("Fetch error:", error);
      }
    }
  };

  fetchRequestDetails();
}, [id]);


  if (!request || !user) {
    return <div className="p-8 text-center">Loading request details...</div>;
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
        <Typography variant="h4" className="font-bold text-gray-800">
          Request Details
        </Typography>
        <Divider />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <Typography variant="h6" className="font-semibold text-gray-700">
            Pickup Location
          </Typography>
          <Typography className="text-gray-600">{request.from}</Typography>
        </div>
        <div>
          <Typography variant="h6" className="font-semibold text-gray-700">
            Destination
          </Typography>
          <Typography className="text-gray-600">{request.to}</Typography>
        </div>
      </div>

      <div className="flex flex-wrap gap-8 justify-between">
        <div className="flex items-center space-x-2">
          <EventIcon className="text-gray-500" />
          <Typography>{new Date(request.date).toLocaleDateString()}</Typography>
        </div>
        <div className="flex items-center space-x-2">
          <AccessTimeIcon className="text-gray-500" />
          <Typography>{formatTime(request.time)}</Typography>
        </div>
        <div className="flex items-center space-x-2">
          <AttachMoneyIcon className="text-gray-500" />
          <Typography>{Number(request.price).toFixed(2)}</Typography>
        </div>
      </div>

      <Divider />

      <div>
        <Typography variant="h6" className="font-semibold text-gray-700">
          User Information
        </Typography>
        <Typography className="flex items-center space-x-2">
          {/* <PersonIcon className="text-gray-500" /> */}
          <span>Name: {user.name}</span>
        </Typography>
        <Typography>Email: {user.email}</Typography>
      </div>

      <div className="text-center">
                <Button
                    onClick={handleOffer}
                    variant="contained"
                    size="large"
                    sx={{
                            backgroundColor: 'rgb(22, 163, 74)', // Equivalent to bg-orange-500
                                '&:hover': {
                    backgroundColor: 'rgb(16, 130, 55)', // Equivalent to hover:bg-orange-600
                    },
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    borderRadius: '1rem',
                    }}
                >
                    Book Now - ${Number(request.price || 0).toFixed(2)}
                </Button>
            </div>
    </div>
  );
};

export default RequestInfo;
