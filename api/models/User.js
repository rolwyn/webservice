const Sequelize = require('sequelize')
const db = require('../../config/database')

const User = db.define('users', {
    id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    username: {
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
    verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    verified_on: {
        type: Sequelize.DATE
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