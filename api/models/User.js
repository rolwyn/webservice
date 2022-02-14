const Sequelize = require('sequelize')
const db = require('../../config/database')

const User = db.define('users', {
    id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    emailid: {
        type: Sequelize.STRING,
        unique: true
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
        type: Sequelize.DATE
    },
    account_updated: {
    type: Sequelize.DATE
    }
    }, {
    createdAt: 'account_created',
    updatedAt: 'account_updated',
})

/**
 * exports User model
 */
module.exports = User