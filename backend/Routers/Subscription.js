const express = require('express');
const payment = require('../Controllers/subscriptionController');
const router = express.Router();

router.post('/pay', payment );

module.exports = router;