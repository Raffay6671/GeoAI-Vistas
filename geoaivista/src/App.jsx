/** @format */

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import PreviewMap from "./pages/PreviewMap/PreviewMap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "../src/components/Footer/Footer";
import LandingPage from "./pages/LandingPage/LandingPage";
import AboutUs from './pages/AboutUs/AboutUs'; // Adjust the path if necessary


function App() {
	return (
		<Router>
			<Navbar />
			<main>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/home" element={<Home />} />
					<Route path="/preview" element={<PreviewMap />} />
					<Route path="/about-us" element={<AboutUs />} /> {/* Add this line */}

				</Routes>
			</main>
			<Footer />
		</Router>
	);
}

export default App;
