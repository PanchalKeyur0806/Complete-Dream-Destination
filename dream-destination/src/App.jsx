// App.jsx
import React, { useState } from "react";
import Navbar from "./component/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import { Route, Routes } from "react-router-dom";
import LoginPopUp from "./component/LoginPopUp/LoginPopUp";
import ExploreMenu from "./component/ExploreMenu/ExploreMenu";
import TourDisplay from "./component/TourDisplay/TourDisplay";
import AdminPanel from "./Admin/AdminPanel/AdminPanel";
import Package from "./Admin/Package/Package";
import Payment from "./Admin/Payment/Payment";
import Feedback from "./Admin/Feedback/Feedback";
import User from "./Admin/User/User";
import Contact from "./Admin/Contact/Contact";
import ForgotPassword from "./component/ForgotPassword/ForgotPassword";
import ResetPassword from "./component/ResetPassword/ResetPassword";

import ContactForm from "./component/ContactForm/ContactForm";

//
import TourItem from "./component/TourItem/TourItem";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [userName, setUserName] = useState("");

  return (
    <>
      {showLogin ? (
        <LoginPopUp setShowLogin={setShowLogin} setUserName={setUserName} />
      ) : null}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} userName={userName} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          <Route path="/explore" element={<ExploreMenu />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/contacts" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/tour" element={<TourDisplay />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/package" element={<Package />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/user" element={<User />} />
          <Route path="/tour/:id" element={<TourItem />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
