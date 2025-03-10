import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Footer from './components/Footer.jsx';
import {Route, Routes} from 'react-router-dom';
import RideOfferCard from './components/RideOfferCard.jsx';
import SearchBar from './components/SearchBar.jsx';
import Rides from './components/Rides.jsx';
import SignupPage from './components/SignupPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import PostRequestForm from './components/PostRequestForm.jsx';
import PostRideForm from './components/PostRideForm.jsx';
import Requests from './components/Requests.jsx';
import RideInfo from './components/RideInfo.jsx';
import RequestInfo from './components/RequestInfo.jsx';
import { RideBookings } from './components/RideBookings.jsx';
import { RequestBookings } from './components/RequestBookings.jsx';
import MyRides from './components/MyRides.jsx';
import MyRequests from './components/MyRequests.jsx';
import Inbox from './components/Inbox.jsx';
import { ConfirmedRides } from './components/ConfirmedRides.jsx';

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/rides" element={<Rides/>} />
        <Route path="/requests" element={<Requests/>}/>
        <Route path="/newride" element={<PostRideForm/>}></Route>
        <Route path="/newrequest" element={<PostRequestForm/>}></Route>
        <Route path="/signup" element={<SignupPage/>}></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/rides/my" element={<MyRides />}/>
        <Route path="/requests/my" element={<MyRequests />} />
        <Route path="/rides/:id" element={<RideInfo/>}/>
        <Route path="/requests/:id" element={<RequestInfo/>}/>

        <Route path="/ridebookings" element={<RideBookings />} />
        <Route path="/requestbookings" element={<RequestBookings />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/bookings" element={<ConfirmedRides />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App;
