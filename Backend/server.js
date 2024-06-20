/** @format */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const imageRoutes = require("./routes/imageRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error);
	});

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use("/api/users", userRoutes);
app.use("/api/images", imageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port http://localhost:${PORT}`);
});
