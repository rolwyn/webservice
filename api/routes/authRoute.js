// import express from 'express'
// import * as authController from '../../controllers/authController.js'
// // import verifySignUpDetails from '../../middlewares/verifySignUpDetails.js'
// import User from '../../models/User.js'

const express = require('express')
const controller = require('../controllers/authController.js')
const User = require('../models/User')
const basicAuth = require('../middleware/basicAuth')

const { body } = require('express-validator');
const app = require('../app');

const router = express.Router();
/**
 * auth urls
 * get      - get data
 * post     - add data
 * put      - update the existing data
 * delete   - delete data from db
 */

router.route('/')
   .post(
      body('emailid').isEmail(),
      body('firstname').not().isEmpty(),
      body("password").isStrongPassword({
         minLength: 8,
         minNumbers: 1,
         minUppercase: 1
      })
     .withMessage("Password length should be greater than 8 with 1 uppercase and minimum 1 numeric"),
      controller.signup
   )


router.route('/self')
   .get(
      basicAuth,
      controller.authenticate
   )
   .put(
      basicAuth,
      controller.updateUser
   )

// export default router
module.exports = router