import RideOfferCard from "./RideOfferCard";
import SearchBar from "./SearchBar";

const rideOffers = [
  [
    "Elliot",
    "https://via.placeholder.com/80",
    "Edmonton, AB, Canada",
    "Summerside, AB, Canada",
    "2025-02-01",
    "5:15 PM",
    "2025-02-01",
    "8:30 PM",
    "https://via.placeholder.com/80",
    "$5",
    "3 seats left",
  ],
  [
    "Sarah",
    "https://via.placeholder.com/80",
    "Calgary, AB, Canada",
    "Banff, AB, Canada",
    "2025-02-02",
    "10:00 AM",
    "2025-02-02",
    "12:30 PM",
    "https://via.placeholder.com/80",
    "$10",
    "2 seats left",
  ],
];

export default function Rides() {
  return (
    <div className="flex flex-col items-center p-4">
      {/* Search Bar */}
      <div className="w-full max-w-4xl mb-6">
        <SearchBar />
      </div>

      {/* Ride Offers List */}
      <div className="w-full max-w-4xl flex flex-col justify-center">
        <div className="col-span-1 md:col-span-2 justify-center items-center">
          {rideOffers.map((offer, index) => (
            <RideOfferCard
              key={index}
              username={offer[0]}
              profilePicUrl={offer[1]}
              fromCity={offer[2]}
              toCity={offer[3]}
              fromDate={offer[4]}
              fromTime={offer[5]}
              toDate={offer[6]}
              toTime={offer[7]}
              carPicUrl={offer[8]}
              price={offer[9]}
              seatsLeft={offer[10]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
