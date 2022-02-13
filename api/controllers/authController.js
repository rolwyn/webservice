// import { response } from 'express'
// import * as authService from '../services/authService.js'
// import User from '../models/User.js'

const { response } = require('express')
const { signupuser } = require('../services/authService')
const User = require('../models/User')

/**
 * Set a success response
 * 
 * @param {*} data take the response of the query and returns as JSON
 * @param {*} res server response if call is successful
 */
const setSuccessResponse = (data, res) => {
    res.status(200);
    res.json(data)
}

/**
 * Set a error response
 * 
 * @param {*} message the message if there is an error (returned from catch block)
 * @param {*} res will return 500 response status code if there is an error
 */
const setErrorResponse = (message, res) => {
    res.status(500);
    res.json({ error: message });
}

const signup = async (req, res) => {
    try {
        const user = {...req.body}
        const newUser = await signupuser(user)
        const userData = newUser.toJSON()
        delete userData['password']
        setSuccessResponse(userData, res)
    } catch (e) {
        setErrorResponse(e.message, res)
    }
};

module.exports = {
    signup
}