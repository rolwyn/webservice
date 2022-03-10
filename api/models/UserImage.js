const Sequelize = require('sequelize')
const db = require('../../config/database')

const UserPic = db.define('userpics', {
    id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    file_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // metadata: {
    //     type: Sequelize.STRING
    // },
    upload_date: {
        type: Sequelize.DATE
    },
    update_date: {
        type: Sequelize.DATE
    }
    }, {
    createdAt: 'upload_date',
    updatedAt: 'update_date',
})

/**
 * exports User model
 */
module.exports = UserPic