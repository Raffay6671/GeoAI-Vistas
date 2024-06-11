/** @format */

import { useState, useContext, createContext, useEffect } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

export function useUser() {
	return useContext(UserContext);
}

export function UserProvider({ children }) {
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

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
		<UserContext.Provider value={{ token, setToken, loggedIn, setLoggedIn }}>
			{children}
		</UserContext.Provider>
	);
}

// Add propTypes validation
UserProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
