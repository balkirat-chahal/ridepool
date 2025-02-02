import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white w-full">
      {/* Centered container for desktop */}
      <div className="mx-auto md:w-8/12 w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800">RidePool</Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/rides" className="text-gray-600 hover:text-green-600 transition-colors duration-200">
              Find Riders
            </Link>
            <Link to="/rides" className="text-gray-600 hover:text-orange-700 transition-colors duration-200">
              Find Drivers
            </Link>
            <AccountCircleIcon className="text-gray-600 h-8 w-8" />
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-4">
            <AccountCircleIcon className="text-gray-600 h-8 w-8" />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (full width) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/rides" className="block w-full text-left px-3 py-2 text-gray-600 hover:text-green-600">
              Find Riders
            </Link>
            <Link to ="/rides" className="block w-full text-left px-3 py-2 text-gray-600 hover:text-orange-700">
              Find Drivers
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;