const User = require('../models/User')

/**
 * save function returns a promise when data is saved
 * create a user and insert it in db
 * 
 * @param {user} the user 
 * @returns the save promise 
 */

const signupuser = (user) => {
    return User.create(user)
}

const checkExistingUser = (emailid) => {
    return User.findOne({ where: { emailid: emailid } })
}

const modifyUser = (existingUser) => {
    return existingUser.save()
}

module.exports = {signupuser, checkExistingUser, modifyUser}