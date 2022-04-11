const express = require('express')
const controller = require('../controllers/authController.js')
const logger = require('simple-node-logger').createSimpleLogger();

const { body } = require('express-validator');
const app = require('../app');

const router = express.Router();

router.route('/')
    .get(
        controller.verifyUser
    )
    // req.query
// export default router
module.exports = router