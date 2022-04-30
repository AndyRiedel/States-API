const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');

router.route('/:state').get(statesController.getState);
router.route('/').get(statesController.getAllStates);


module.exports = router; 