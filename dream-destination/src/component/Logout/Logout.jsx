import React from "react";
import Cookies from "js-cookie"; // Import js-cookie to manage cookies

function Logout({ setUserName, setShowLogin }) {
  const handleLogout = () => {
    // Remove JWT cookie
    Cookies.remove("jwt");

    // Reset userName state
    setUserName(null);

    // Optionally, show login form if necessary
    setShowLogin(true);
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
