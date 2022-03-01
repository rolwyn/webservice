const Sequelize = require('sequelize')

//connect to postgres server
const db = new Sequelize('testdb', 'postgres', '', {
    host:  '127.0.0.1',
    dialect: 'postgres',
    port: 3000,
    operatorsAlias: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})

module.exports = db;