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
      </Routes>
      <Footer />
    </>
  )
}

export default App;
