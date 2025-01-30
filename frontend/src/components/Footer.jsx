import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import Link from '@mui/icons-material/Link';

const Footer = () => {
  return (
    <footer className="bg-white w-full mt-12 border-t">
      <div className="mx-auto md:w-8/12 w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">RidePool</h3>
            <p className="text-gray-600 text-sm">
              Connecting communities through sustainable transportation
            </p>
            <div className="flex space-x-4">
              <FacebookIcon className="text-gray-600 hover:text-green-600 cursor-pointer transition-colors" />
              <TwitterIcon className="text-gray-600 hover:text-green-600 cursor-pointer transition-colors" />
              <InstagramIcon className="text-gray-600 hover:text-green-600 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Explore</h4>
            <div className="flex flex-col space-y-2">
              <button className="text-gray-600 hover:text-green-600 text-left transition-colors duration-200">
                About Us
              </button>
              <button className="text-gray-600 hover:text-orange-700 transition-colors duration-200 text-left">
                Safety Guidelines
              </button>
              <button className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-left">
                Careers
              </button>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Legal</h4>
            <div className="flex flex-col space-y-2">
              <button className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-left">
                Privacy Policy
              </button>
              <button className="text-gray-600 hover:text-orange-700 transition-colors duration-200 text-left">
                Terms of Service
              </button>
              <button className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-left">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-600 text-sm">
              © 2024 RidePool. All rights reserved.
            </p>
            <div className="flex items-center space-x-2">
              <Link className="text-gray-600" />
              <span className="text-gray-600 text-sm">Available countrywide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;