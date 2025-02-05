import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Footer from './components/Footer.jsx';
import {Route, Routes} from 'react-router-dom';
import RideOfferCard from './components/RideOfferCard.jsx';
import SearchBar from './components/SearchBar.jsx';
import Rides from './components/Rides.jsx';
import PostForm from './components/PostForm.jsx';
import SignupPage from './components/SignupPage.jsx';
import LoginPage from './components/LoginPage.jsx';

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/rides" element={<Rides/>} />
        <Route path="/new" element={<PostForm />}></Route>
        <Route path="/signup" element={<SignupPage/>}></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
      </Routes>
      <Footer />
    </>
  )
}

export default App;
