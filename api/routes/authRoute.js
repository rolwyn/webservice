// import express from 'express'
// import * as authController from '../../controllers/authController.js'
// // import verifySignUpDetails from '../../middlewares/verifySignUpDetails.js'
// import User from '../../models/User.js'

const express = require('express')
const { signup } = require('../controllers/authController.js')
const User = require('../models/User')

const router = express.Router();
/**
 * all auth urls will here here
 * get      - get all data
 * post     - add new data
 * put      - update on existing data
 * delete   - delete the data from db
 */

// router.route('/signup')
//    .post(
//       verifySignUpDetails.checkForDuplicateUnameEmail,
//       authController.signup)

// router.route('/login')
//    .post(
//       verifySignUpDetails.checkExistingUser,
//       authController.login)

router.route('/')
   .get((req, res) => 
   User.findAll()
      .then(users => {
         console.log(users);
         res.sendStatus(200);
      })
   .catch(err => console.log(err)))


router.route('/user')
   .post(signup)

// export default router
module.exports = router