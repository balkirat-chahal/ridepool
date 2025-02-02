import { useState } from "react";
import CalendarToday from '@mui/icons-material/CalendarToday';
import People from '@mui/icons-material/People';
import DirectionsCar from '@mui/icons-material/DirectionsCar';
import Eco from '@mui/icons-material/EnergySavingsLeaf';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import { Link } from "react-router-dom";

export default function Home() {

  const [riderFrom, setRiderFrom] = useState('');
  const [riderTo, setRiderTo] = useState('');
  const [riderDate, setRiderDate] = useState('');
  
  const [driverFrom, setDriverFrom] = useState('');
  const [driverTo, setDriverTo] = useState('');
  const [driverDate, setDriverDate] = useState('');

  return (
    <div className="flex flex-col items-center p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-4">Carpool for the Planet</h1>
      <p className="text-gray-600 text-center max-w-2xl">
        Join millions who carpool between cities in Canada. 
        <span className="font-semibold italic"> Free sign up.</span>
      </p>

      <div className="mt-10 w-full max-w-6xl space-y-12">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Need a Ride Form */}
          <div className="bg-[#ffedd5] shadow-lg rounded-2xl p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Need a ride?</h2>
            <p className="text-sm text-gray-600 mb-4">Find a ride and carpool anywhere in Canada.</p>
            <input 
              type="text" 
              placeholder="From" 
              className="w-full p-2 mb-2 border rounded-md bg-white"
              value={riderFrom}
              onChange={(e) => setRiderFrom(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="To" 
              className="w-full p-2 mb-2 border rounded-md bg-white"
              value={riderTo}
              onChange={(e) => setRiderTo(e.target.value)}
            />
            <div className="relative mb-4">
              <CalendarToday className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="date" 
                className="w-full p-2 pl-10 border rounded-md bg-white"
                value={riderDate}
                onChange={(e) => setRiderDate(e.target.value)}
              />
            </div>
            <Link to={`/rides?type=0&from=${encodeURIComponent(riderFrom)}&to=${encodeURIComponent(riderTo)}&date=${encodeURIComponent(riderDate)}`}>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 items-center justify-center hover:cursor-pointer">
                <p className="mx-auto">Find a ride</p>
              </button>
            </Link>
          </div>

          {/* Right: Fun Stats */}
          <div className="bg-[#f0f9ff] p-6 rounded-2xl shadow-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl text-center">
                <People className="text-blue-500 mx-auto text-3xl mb-2" />
                <div className="text-2xl font-bold">1.2M+</div>
                <div className="text-sm text-gray-600">Monthly Rides</div>
              </div>
              <div className="bg-white p-4 rounded-xl text-center">
                <DirectionsCar className="text-green-500 mx-auto text-3xl mb-2" />
                <div className="text-2xl font-bold">$42M+</div>
                <div className="text-sm text-gray-600">Saved in Fuel</div>
              </div>
              <div className="bg-white p-4 rounded-xl text-center">
                <Eco className="text-emerald-500 mx-auto text-3xl mb-2" />
                <div className="text-2xl font-bold">286K+</div>
                <div className="text-sm text-gray-600">Tons CO2 Saved</div>
              </div>
              <div className="bg-white p-4 rounded-xl text-center">
                <EmojiEvents className="text-yellow-500 mx-auto text-3xl mb-2" />
                <div className="text-2xl font-bold">#1</div>
                <div className="text-sm text-gray-600">In Sustainable Transport</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Benefits */}
          <div className="bg-[#fef2f2] p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Why Ride With Us?</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-white p-2 rounded-full">
                  <People className="text-blue-500" />
                </div>
                <div>
                  <div className="font-medium">Meet Like-minded Travelers</div>
                  <p className="text-sm text-gray-600">Connect with fellow eco-conscious commuters</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-white p-2 rounded-full">
                  <DirectionsCar className="text-green-500" />
                </div>
                <div>
                  <div className="font-medium">Comfortable Rides</div>
                  <p className="text-sm text-gray-600">Verified drivers and well-maintained vehicles</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-white p-2 rounded-full">
                  <Eco className="text-emerald-500" />
                </div>
                <div>
                  <div className="font-medium">Eco-Friendly Choice</div>
                  <p className="text-sm text-gray-600">Reduce your carbon footprint by up to 75%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Driving Form */}
          <div className="bg-[#d1fae5] shadow-lg rounded-2xl p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Driving somewhere?</h2>
            <p className="text-sm text-gray-600 mb-4">Post empty seats and cover your driving costs.</p>
            <input 
              type="text" 
              placeholder="From" 
              className="w-full p-2 mb-2 border rounded-md bg-white"
              value={driverFrom}
              onChange={(e) => setDriverFrom(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="To" 
              className="w-full p-2 mb-2 border rounded-md bg-white"
              value={driverTo}
              onChange={(e) => setDriverTo(e.target.value)}
            />
            <div className="relative mb-4">
              <CalendarToday className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="date" 
                className="w-full p-2 pl-10 border rounded-md bg-white"
                value={driverDate}
                onChange={(e) => setDriverDate(e.target.value)}
              />
            </div>
            <Link to={`/rides?type=1&from=${encodeURIComponent(driverFrom)}&to=${encodeURIComponent(driverTo)}&date=${encodeURIComponent(driverDate)}`}>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 hover:cursor-pointer">
                Find Riders
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}