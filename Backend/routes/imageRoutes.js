// routes/imageRoutes.js
const express = require('express');
const { uploadImage, addImage, getImages } = require('../controllers/imageController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getImages).post(protect, uploadImage, addImage);

module.exports = router;
