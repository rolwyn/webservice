const { response } = require('express')
const { signupuser, checkExistingUser, modifyUser } = require('../services/authService')
const User = require('../models/User')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')
const statsDClient = require('statsd-client')
const sdc = new statsDClient({ host: 'localhost', port: 8125 })

/**
 * Set a success response
 * 
 * @param {*} data take the response of the query and returns as JSON
 * @param {*} res server response if call is successful
 */
const setSuccessResponse = (data, res, successCode=200) => {
    res.status(successCode);
    res.json(data)
}

/**
 * Set a error response
 * 
 * @param {*} message the message if there is an error (returned from catch block)
 * @param {*} res will return 500 response status code if there is an error
 */
const setErrorResponse = (message, res, errCode=500) => {
    res.status(errCode);
    if (errCode == 500)
        res.json();
    res.json({ error: message });
}

/**
 * 
 * @param {req} req body
 * @param {res} the response to be sent 
 * @returns a success response json or error 
 */
const signup = async (req, res) => {
    try {
        sdc.increment('POST /v1/user');
        // express validator to check if errors
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return setErrorResponse(validationErrors.array(), res, 400)
        }
        // give bad request if the following fields are found
        if (req.body.account_created || req.body.account_updated || req.body.createdAt|| req.body.updatedAt || req.body.id) 
            return setErrorResponse(`Fields id, account_created, account_updated, updatedAt and createdAt are not accepted`, res, 400)

        // check if user exists
        const existingUser = await checkExistingUser(req.body.username)
        if (typeof existingUser === 'object' && existingUser !== null) 
            return setErrorResponse(`User already exists or there is some error`, res, 400)

        const user = {...req.body, password: bcrypt.hashSync(req.body.password, 8)}
        const newUser = await signupuser(user)

        // convert to json and return response without password
        const userData = newUser.toJSON()
        let {password, ...newUserData} = {...userData}
        setSuccessResponse(newUserData, res, 201)
    } catch (e) {
        setErrorResponse(e.message, res)
    }
};

const authenticate = async (req, res) => {
    try {
        sdc.increment('GET /v1/user/self');
        // the username and password from Basic Auth
        const requsername = req.credentials.name
        const reqpassword = req.credentials.pass

        // pass header username(email) to check if user exists
        const existingUser = await checkExistingUser(requsername.toLowerCase())
        if (existingUser == null) return setErrorResponse(`User not found`, res, 401)

        let isPasswordMatch = bcrypt.compareSync(
            reqpassword,
            existingUser.password
        );
 
        // if wrong password throw 401
        if (!isPasswordMatch) return setErrorResponse(`Credentials do not match`, res, 401)

        const userData = existingUser.toJSON()
        let {password, ...newUserData} = {...userData}

        setSuccessResponse(newUserData, res)
    } catch (e) {
        setErrorResponse(e.message, res)
    }
}

const updateUser = async (req, res) => {
    try {
        sdc.increment('PUT /v1/user/self');
        // if any validation fails
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return setErrorResponse(validationErrors.array(), res, 400)
        }
        
        // the username and password from Basic Auth
        const requsername = req.credentials.name
        const reqpassword = req.credentials.pass

        // pass header username(email) to check if user exists
        let existingUser = await checkExistingUser(requsername.toLowerCase())
        if (existingUser == null) return setErrorResponse(`User not found`, res, 401)

        let isPasswordMatch = bcrypt.compareSync(
            reqpassword,
            existingUser.password
        );
 
        // if wrong password throw 401
        if (!isPasswordMatch) return setErrorResponse(`Credentials do not match`, res, 401)

        // if the following field exists in request body throw Bad Request
        if (req.body.account_created || req.body.account_updated || req.body.createdAt|| req.body.updatedAt 
            || req.body.id || req.body.username) 
            return setErrorResponse(`{ Fields_not_allowed: id, username, account_created, account_updated, updatedAt and createdAt are not accepted }`, res, 400)
        
        // append the details to the authenticated user
        existingUser.firstname = req.body.firstname
        existingUser.lastname = req.body.lastname
        existingUser.password =  bcrypt.hashSync(req.body.password, 8)
        
        // call the modifyUser service
        const updateUser = await modifyUser(existingUser)
        setSuccessResponse('', res, 204)
        
    } catch (e) {
        setErrorResponse(e.message, res)
    }
}

module.exports = {
    signup, authenticate, updateUser
}