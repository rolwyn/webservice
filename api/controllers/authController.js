const { response } = require('express')
const { signupuser, checkExistingUser, modifyUser } = require('../services/authService')
const User = require('../models/User')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')

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
        if (req.body.account_created || req.body.account_updated || req.body.createdAt|| req.body.updatedAt || req.body.id) 
            return setErrorResponse(`Fields id, account_created, account_updated, updatedAt and createdAt are not accepted`, res, 400)

        // if (req.body.createdAt) delete req.body['createdAt']
        // if (req.body.updatedAt) delete req.body['updatedAt']

        const existingUser = await checkExistingUser(req.body.emailid)
        if (typeof existingUser === 'object' && existingUser !== null) 
            return setErrorResponse(`User already exists or there is some error`, res, 400)

        const user = {...req.body, password: bcrypt.hashSync(req.body.password, 8)}
        const newUser = await signupuser(user)
        const userData = newUser.toJSON()
        // userData.account_created = userData.createdAt;
        // userData.account_updated = userData.updatedAt;
        // delete userData['createdAt']
        // delete userData['updatedAt']
        // delete userData['password']

        let {password, ...newUserData} = {...userData}
        setSuccessResponse(newUserData, res)
    } catch (e) {
        setErrorResponse(e.message, res)
    }
};

const authenticate = async (req, res) => {
    try {
        console.log('///////////')
        console.log(req.credentials.pass)

        const requsername = req.credentials.name
        const reqpassword = req.credentials.pass

        // pass header username(email) to check if user exists
        const existingUser = await checkExistingUser(requsername.toLowerCase())
        if (existingUser == null) return setErrorResponse(`User not found`, res, 400)

        let isPasswordMatch = bcrypt.compareSync(
            reqpassword,
            existingUser.password
        );

        console.log("--------------")
        console.log(isPasswordMatch)
 
        if (!isPasswordMatch) return setErrorResponse(`Credentials do not match`, res, 401)

        const userData = existingUser.toJSON()
        userData.username = userData.emailid;
        let {password, emailid, ...newUserData} = {...userData}

        setSuccessResponse(newUserData, res)
    } catch (e) {
        setErrorResponse(e.message, res)
    }
}

const updateUser = async (req, res) => {
    try {
        console.log('//////////////////////////')
        console.log(Sequelize.NOW)

        const requsername = req.credentials.name
        const reqpassword = req.credentials.pass

        // pass header username(email) to check if user exists
        let existingUser = await checkExistingUser(requsername.toLowerCase())
        if (existingUser == null) return setErrorResponse(`User not found`, res, 400)

        let isPasswordMatch = bcrypt.compareSync(
            reqpassword,
            existingUser.password
        );

        console.log("--------------")
        console.log(isPasswordMatch)
 
        if (!isPasswordMatch) return setErrorResponse(`Credentials do not match`, res, 401)

        if (req.body.account_created || req.body.account_updated || req.body.createdAt|| req.body.updatedAt 
            || req.body.id || req.body.emailid) 
            return setErrorResponse(`{ Fields_not_allowed: id, username/emailid, account_created, account_updated, updatedAt and createdAt are not accepted }`, res, 400)
        
        existingUser.firstname = req.body.firstname
        existingUser.lastname = req.body.lastname
        existingUser.password =  bcrypt.hashSync(req.body.password, 8)

        const updateUser = await modifyUser(existingUser)
        const updatedUser = updateUser.toJSON()
        updatedUser.username = updatedUser.emailid;
        let {password, emailid, ...newUpdatedUser} = {...updatedUser}
        setSuccessResponse(newUpdatedUser, res)
        
    } catch (e) {
        setErrorResponse(e.message, res)
    }
}

module.exports = {
    signup, authenticate, updateUser
}