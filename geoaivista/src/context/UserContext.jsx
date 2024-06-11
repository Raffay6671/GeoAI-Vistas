/** @format */

import { useState, useContext, createContext } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

export function useUser() {
	return useContext(UserContext);
}

export function UserProvider({ children }) {
	const [token, setToken] = useState(null);
	const [loggedIn, setLoggedIn] = useState(false);

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
