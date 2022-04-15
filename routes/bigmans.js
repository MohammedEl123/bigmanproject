const express = require('express');
const router = express.Router();
const bigmans = require('../controllers/bigmans');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateBigman } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Bigman = require('../models/bigman');

router.route('/')
    .get(catchAsync(bigmans.index))
    .post(isLoggedIn, upload.array('image'), validateBigman, catchAsync(bigmans.createBigman))


router.get('/new', isLoggedIn, bigmans.renderNewForm)

router.route('/:id')
    .get(catchAsync(bigmans.showBigman))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateBigman, catchAsync(bigmans.updateBigman))
    .delete(isLoggedIn, isAuthor, catchAsync(bigmans.deleteBigman));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(bigmans.renderEditForm))



module.exports = router;