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
    },
    account_created: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    account_updated: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
})

/**
 * exports User model
 */
module.exports = User