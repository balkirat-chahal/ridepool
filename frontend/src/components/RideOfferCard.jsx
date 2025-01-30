import { Avatar } from "@mui/material";
import { CheckCircle, AcUnit, People } from "@mui/icons-material";

export default function RideOfferCard({
  username,
  profilePic,
  fromDate,
  fromTime,
  fromCity,
  toDate,
  toTime,
  toCity,
  carPic,
  price,
  seatsLeft,
}) {
  return (
    <div className="border rounded-lg p-3 flex flex-col sm:flex-row items-start gap-3 sm:gap-4 w-full hover:bg-gray-50 transition-colors">
      {/* Profile Section */}
      <div className="flex items-center gap-3 min-w-[180px]">
        <Avatar src={profilePic} alt={username} className="w-10 h-10" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-medium text-sm">{username}</span>
            <CheckCircle className="text-blue-500" sx={{ fontSize: 16 }} />
          </div>
          <span className="text-xs text-gray-500">1 driven</span>
        </div>
      </div>

      {/* Vertical Separator */}
      <div className="hidden sm:block w-px h-8 bg-gray-200" />

      {/* Ride Info */}
      <div className="flex-1 min-w-[200px]">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-sm">{fromCity}</span>
          <span className="text-gray-400 text-xs">→</span>
          <span className="font-medium text-sm">{toCity}</span>
        </div>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
          <div>
            <span className="font-medium">{fromDate}</span>
            <span className="mx-1">•</span>
            <span>{fromTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <People sx={{ fontSize: 16 }} />
            <span>{seatsLeft} seats</span>
          </div>
        </div>
      </div>

      {/* Vertical Separator */}
      <div className="hidden sm:block w-px h-8 bg-gray-200" />

      {/* Car & Pricing */}
      <div className="flex items-center gap-4 sm:gap-3">
        <img 
          src={carPic} 
          alt="Car" 
          className="w-16 h-12 object-cover rounded-md border" 
        />
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-blue-500">
            <AcUnit sx={{ fontSize: 18 }} />
            <span className="font-semibold text-sm">${price}</span>
          </div>
          <span className="text-xs text-gray-500 mt-1">Nissan Versa</span>
        </div>
      </div>
    </div>
  );
}