const User = require('../models/User')

/**
 * save function returns a promise when data is saved
 * create a user and insert it in db
 * 
 * @param {user} the user 
 * @returns the save promise 
 */

/**
 * 
 * @param {user} user body from request 
 * @returns a new user
 */
const signupuser = (user) => {
    return User.create(user)
}

/**
 * 
 * @param {username} username of the user
 * @returns the user
 */
const checkExistingUser = (username) => {
    return User.findOne({ where: { username: username } })
}

/**
 * 
 * @param {existingUser} existing user from db
 * @returns updated user information
 */
const modifyUser = (existingUser) => {
    return existingUser.save()
}

module.exports = {signupuser, checkExistingUser, modifyUser}