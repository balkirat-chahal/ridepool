import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    dob: null,
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form data:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🎉 Create Your Account
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <TextField
                label="Email Address"
                variant="outlined"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                  label="First Name"
                  variant="outlined"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
                
                <TextField
                  label="Last Name"
                  variant="outlined"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dob}
                  onChange={(newValue) => setFormData({...formData, dob: newValue})}
                  renderInput={(params) => <TextField {...params} required />}
                  maxDate={dayjs().subtract(18, 'year')}
                />
              </LocalizationProvider>

              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              className="!bg-green-600 hover:!bg-green-700 !text-white !font-bold !py-3 !rounded-lg !transition-all"
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;