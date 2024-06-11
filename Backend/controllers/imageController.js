/** @format */

// controllers/imageController.js
const fs = require("fs");
const multer = require("multer");
const Image = require("../models/Image");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadDir = "uploads/";
		// Create the uploads directory if it doesn't exist
		fs.mkdirSync(uploadDir, { recursive: true });
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
		cb(null, true);
	} else {
		cb(new Error("Unsupported file type"), false);
	}
};

const upload = multer({
	storage,
	fileFilter,
}).single("image");

const uploadImage = (req, res, next) => {
	upload(req, res, (err) => {
		if (err) {
			return res.status(400).json({ message: err.message });
		}
		next();
	});
};

const addImage = async (req, res) => {
	try {
		const { filename } = req.file;
		const imageUrl = `/uploads/${filename}`;

		const newImage = new Image({
			name: req.body.name,
			imageUrl,
		});

		await newImage.save();
		res.status(201).json(newImage);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getImages = async (req, res) => {
	try {
		const images = await Image.find();
		res.status(200).json(images);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	uploadImage,
	addImage,
	getImages,
};
