// PostRequestForm.jsx
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import axios from 'axios';

const PostRequestForm = () => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: null,
    time: null,
    price: '',
    riders: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      from: formData.from,
      to: formData.to,
      datetime: dayjs(formData.date).hour(dayjs(formData.time).hour()).minute(dayjs(formData.time).minute()),
      price: parseFloat(formData.price),
    };

    try {
      const response = await axios.post('/api/requests/new', payload);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error posting request:', error);
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