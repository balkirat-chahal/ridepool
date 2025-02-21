import { Avatar } from "@mui/material";
import { CheckCircle, People, ArrowRightAlt } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

function RideRequestCard({
  id,
  username,
  profilePic,
  from,
  to,
  date,
  time,
  price,
  riders,
}) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/requests/" + id);
  }
  return (
    <div onClick={handleClick} className="group border border-gray-200 rounded-xl p-4 w-full hover:shadow-lg transition-all duration-300 my-3 mx-auto bg-white">
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
          <span className="text-xl font-bold text-purple-600">{price}</span>
        </div>
      </div>
    </div>
  );
}

export default RideRequestCard;