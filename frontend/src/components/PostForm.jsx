import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

const PostForm = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const type = parseInt(searchParams.get('type')) || 0;

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: null,
    time: null,
    price: '',
    carMake: '',
    carModel: '',
    carYear: '',
    seats: '',
    riders: ''
  });

  useEffect(() => {
    // Reset specific fields when type changes
    setFormData(prev => ({
      ...prev,
      carMake: '',
      carModel: '',
      carYear: '',
      seats: '',
      riders: ''
    }));
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      from: formData.from,
      to: formData.to,
      datetime: dayjs(formData.date).hour(dayjs(formData.time).hour()).minute(dayjs(formData.time).minute()),
      price: parseFloat(formData.price),
      ...(type === 0 ? {
        carMake: formData.carMake,
        carModel: formData.carModel,
        carYear: parseInt(formData.carYear),
        seats: parseInt(formData.seats)
      } : {
        riders: parseInt(formData.riders)
      })
    };

    const endpoint = type === 0 ? '/api/rides/new' : '/api/requests/new';
    // Here you would make your POST request
    console.log('Submitting to', endpoint, payload);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {type === 0 ? '🚗 Post a Ride' : '🙋 Post a Request'}
          </h2>
          
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

              {type === 0 ? (
                <>
                  <TextField
                    label="Car Make"
                    variant="outlined"
                    required
                    value={formData.carMake}
                    onChange={(e) => setFormData({...formData, carMake: e.target.value})}
                  />
                  
                  <TextField
                    label="Car Model"
                    variant="outlined"
                    required
                    value={formData.carModel}
                    onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                  />
                  
                  <TextField
                    label="Car Year"
                    variant="outlined"
                    type="number"
                    required
                    value={formData.carYear}
                    onChange={(e) => setFormData({...formData, carYear: e.target.value})}
                  />
                  
                  <TextField
                    label="Available Seats"
                    variant="outlined"
                    type="number"
                    required
                    value={formData.seats}
                    onChange={(e) => setFormData({...formData, seats: e.target.value})}
                  />
                </>
              ) : (
                <TextField
                  label="Number of Riders"
                  variant="outlined"
                  type="number"
                  required
                  value={formData.riders}
                  onChange={(e) => setFormData({...formData, riders: e.target.value})}
                />
              )}
            </div>

            <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                className={`!text-white !font-bold !py-3 !rounded-lg !transition-all ${
                        type === 0 
                        ? '!bg-green-600 hover:!bg-green-700' 
                        : '!bg-orange-500 hover:!bg-orange-600'
                        }`}
            >
                {type === 0 ? 'Post Ride Now' : 'Post Request'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostForm;