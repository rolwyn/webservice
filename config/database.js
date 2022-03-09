const Sequelize = require('sequelize')

//connect to postgres server
const db = new Sequelize(process.env.DB_NAME_NEW, process.env.DB_USER_NAME_NEW, process.env.DB_PASSWORD_NEW, {
    host:   process.env.DB_ADDRESS_NEW,
    dialect: 'postgres',
    operatorsAlias: false,

    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})

module.exports = db;