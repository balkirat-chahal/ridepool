// PostRequestForm.jsx
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostRequestForm = () => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: null,
    time: null,
    price: '',
    riders: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Define the async function
    const checkAuthentication = async () => {
      try {
        const response = await axios.get('/api/authenticate');
        console.log('Response:', response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/login', { state: { from: '/newrequest' } });
        } else {
          console.error('Error checking authentication:', error);
        }
      }
    };

    // Call the async function
    checkAuthentication();
  }, [navigate]); // Add `navigate` to the dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      from: formData.from,
      to: formData.to,
      datetime: dayjs(formData.date).hour(dayjs(formData.time).hour()).minute(dayjs(formData.time).minute()),
      price: parseFloat(formData.price),
    };

    try {
      const response = await axios.post('/api/requests/new', payload, {withCredentials: true});
      console.log('Response:', response.data);
    } catch (error) {
      if (error.response && error.response.status == 401){
        navigate("/login", {state: { from: "/newrequest" }});
      }
      else {
        console.log("Error posting request: ", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🙋 Post a Request</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <TextField
                label="From"
                variant="outlined"
                required
                value={formData.from}
                onChange={(e) => setFormData({...formData, from: e.target.value})}
              />
              
              <TextField
                label="To"
                variant="outlined"
                required
                value={formData.to}
                onChange={(e) => setFormData({...formData, to: e.target.value})}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={(newValue) => setFormData({...formData, date: newValue})}
                  renderInput={(params) => <TextField {...params} required />}
                />
                
                <TimePicker
                  label="Time"
                  value={formData.time}
                  onChange={(newValue) => setFormData({...formData, time: newValue})}
                  renderInput={(params) => <TextField {...params} required />}
                />
              </LocalizationProvider>

              <TextField
                label="Offer Price"
                variant="outlined"
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                InputProps={{ startAdornment: '₹' }}
              />

              {/* <TextField
                label="Number of Riders"
                variant="outlined"
                type="number"
                required
                value={formData.riders}
                onChange={(e) => setFormData({...formData, riders: e.target.value})}
              /> */}
            </div>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              className="!text-white !font-bold !py-3 !rounded-lg !transition-all !bg-orange-500 hover:!bg-orange-600"
            >
              Post Request
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostRequestForm;