/** @format */

import { useState, useContext, createContext, useEffect } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  // Existing states for token and login management
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  // New state for handling the uploaded image globally
  const [uploadedImage, setUploadedImage] = useState(null);

  // New state for handling the invisible layer
  const [invisibleLayer, setInvisibleLayer] = useState(null); // Add this

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setLoggedIn(true);
    } else {
      localStorage.removeItem("token");
      setLoggedIn(false);
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        token,
        setToken,
        loggedIn,
        setLoggedIn,
        uploadedImage, // Expose uploadedImage in context
        setUploadedImage, // Expose function to set the uploaded image
        invisibleLayer, // Expose invisible layer in context
        setInvisibleLayer, // Expose function to set the invisible layer
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Add propTypes validation
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
