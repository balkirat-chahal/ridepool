import { Avatar, Button } from "@mui/material";
import { CheckCircle, People, ArrowRightAlt } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RequestBookingCard({
  id,
  username,
  profilePic,
  from,
  to,
  date,
  time,
  price,
  riders,
  status,
}) {
  const navigate = useNavigate();

  const handleConfirmRequest = async () => {
    try {
      const response = await axios.post(
        "/api/requests/confirm",
        { id },
        { withCredentials: true }
      );
      console.log("Request booking confirmed:", response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login", { state: { from: "/requestbookings" } });
      } else {
        console.log("Error confirming request booking:", error);
      }
    }
  };

  return (
    <div className="group border border-gray-200 rounded-xl p-4 w-full hover:shadow-lg transition-all duration-300 my-3 mx-auto bg-white cursor-pointer">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar 
            src={profilePic} 
            alt={username} 
            className="w-9 h-9 border-2 border-purple-100"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-800">{username}</span>
              <CheckCircle className="text-green-500" sx={{ fontSize: 16 }} />
            </div>
            <span className="text-xs text-gray-500">3+ rides requested</span>
          </div>
        </div>
      </div>

      {/* Route Details */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{from}</span>
                  <ArrowRightAlt className="text-gray-400" />
                  <span className="font-semibold text-gray-800">{to}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <span>{date}</span>
                  <span className="text-gray-300">•</span>
                  <span>{time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-2">
          <People sx={{ fontSize: 20, color: 'rgb(139, 92, 246)' }} />
          <span className="text-sm text-gray-600">{riders} riders</span>
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-gray-500">max price</span>
          <span className="text-xl font-bold text-purple-600">${price}</span>
        </div>
        <Button onClick={handleConfirmRequest} variant="contained" className="bg-green-500 hover:bg-green-700" sx={{ textTransform: 'none', fontWeight: 'bold' }}>
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default RequestBookingCard;