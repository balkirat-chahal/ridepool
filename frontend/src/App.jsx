import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home.jsx';
import Footer from './components/Footer.jsx';
import {Route, Routes} from 'react-router-dom';
import RideOfferCard from './components/RideOfferCard.jsx';
import SearchBar from './components/SearchBar.jsx';
import Rides from './components/Rides.jsx';

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/rides" element={<Rides/>} />
      </Routes>
      <Footer />
    </>
  )
}

export default App;
