//import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Profile from "./components/pages/Profile";
import Header from "./components/Header/Header";
import CreateListing from "./components/pages/CreateListing";
import Listing from "./components/pages/Listing";
import Search from "./components/pages/Search";
import PrivateRoute from "./components/private/PrivateRoute";
import UpdateListing from "./components/pages/UpdateListing";


function App() {
  return <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/listing/:listingId" element={<Listing />} />  
      <Route path="/search" element={<Search />} />
      <Route element={<PrivateRoute />}>              
        <Route path="/profile" element={<Profile />} />   
        <Route path="/create-listing" element={<CreateListing />} />   
        <Route path="/update-listing/:listingId" element={<UpdateListing />} />   
      </Route>
    </Routes>
  </BrowserRouter>
}

export default App;
