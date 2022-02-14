const Sequelize = require('sequelize')
const db = require('../../config/database')

const User = db.define('users', {
    emailid: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    firstname: {
        type: Sequelize.STRING
    },
    lastname: {
        type: Sequelize.STRING
    }
})

/**
 * exports User model
 */
module.exports = User