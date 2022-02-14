const { response } = require('express')
const { signupuser, checkExistingUser } = require('../services/authService')
const User = require('../models/User')
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

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
const setErrorResponse = (message, res, errCode=500) => {
    res.status(errCode);
    res.json({ error: message });
}

const signup = async (req, res) => {
    try {

        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return setErrorResponse(validationErrors.array(), res, 400)
        }
        // give bad request if the following fields are found
        if (req.body.createdAt || req.body.updatedAt) return setErrorResponse(`Fields updatedAt and createdAt are not accepted`, res, 400)

        // if (req.body.createdAt) delete req.body['createdAt']
        // if (req.body.updatedAt) delete req.body['updatedAt']

        const existingUser = await checkExistingUser(req.body.emailid)
        if (typeof existingUser === 'object' && existingUser !== null) return setErrorResponse(`User already exists or there is some error`, res, 400)

        const user = {...req.body, password: bcrypt.hashSync(req.body.password, 8)}
        const newUser = await signupuser(user)
        const userData = newUser.toJSON()
        userData.account_created = userData.createdAt;
        userData.account_updated = userData.updatedAt;
        // delete userData['createdAt']
        // delete userData['updatedAt']
        // delete userData['password']

        let {createdAt, updatedAt,  password, ...newUserData} = {...userData}
        setSuccessResponse(newUserData, res)
    } catch (e) {
        setErrorResponse(e.message, res)
    }
};

module.exports = {
    signup
}