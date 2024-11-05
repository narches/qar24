// Needed Resources 
const express = require("express");
const router = new express.Router();
const bookController = require("../controllers/bookController");
const beValidate = require("../utilities/be-validation");
const utilities = require("../utilities");

// Deliver Login View
router.get('/', utilities.handleErrors(bookController.buildBooking))



module.exports = router;


