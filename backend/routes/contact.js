const express = require("express");
const router = express.Router();
const contactController = require('../controllers/contact')

router.post("/send", contactController.contact);
router.post("/otp", contactController.otp);
module.exports = router