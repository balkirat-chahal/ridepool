import { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/authenticate', { withCredentials: true });
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/logout', {}, { withCredentials: true });
      if (response.status === 200) {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="bg-white w-full">
      <div className="mx-auto md:w-8/12 w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-gray-800">RidePool</Link>

          <div className="hidden md:flex items-center space-x-8">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-gray-600 hover:text-red-500 transition-colors duration-200">
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-500 transition-colors duration-200">
                Login
              </Link>
            )}
            <Link to="/newride" className="text-gray-600 hover:text-green-600 transition-colors duration-200">
              Post a Ride
            </Link>
            <Link to="/newrequest" className="text-gray-600 hover:text-orange-700 transition-colors duration-200">
              Post a Request
            </Link>
            <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="hover:cursor-pointer">
              <AccountCircleIcon className="text-gray-600 h-8 w-8" />
            </button>
          </div>

          <div className="flex md:hidden items-center space-x-4">
            <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="hover:cursor-pointer">
              <AccountCircleIcon className="text-gray-600 h-8 w-8" />
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-green-600 transition-colors">
              {isMobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/new?type=0" className="block w-full text-left px-3 py-2 text-gray-600 hover:text-green-600">
              Post a Ride
            </Link>
            <Link to="/new?type=1" className="block w-full text-left px-3 py-2 text-gray-600 hover:text-orange-700">
              Post a Request
            </Link>
          </div>
        </div>
      )}

      {isProfileMenuOpen && (
        <div className="w-full bg-white shadow-md">
          <div className="mx-auto md:w-8/12 w-full px-4 sm:px-6 lg:px-8">
            <div className={`py-4 flex ${window.innerWidth >= 768 ? 'flex-row space-x-6' : 'flex-col space-y-2'}`}>
              <Link to="/rides/my" className="text-gray-600 hover:text-green-600 transition-colors duration-200 px-2 py-1">
                My Rides
              </Link>
              <Link to="/requests/my" className="text-gray-600 hover:text-green-600 transition-colors duration-200 px-2 py-1">
                My Requests
              </Link>
              <Link to="/inbox" className="text-gray-600 hover:text-green-600 transition-colors duration-200 px-2 py-1">
                My Inbox
              </Link>
              <Link to="/bookings" className="text-gray-600 hover:text-green-600 transition-colors duration-200 px-2 py-1">
                My Bookings
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
