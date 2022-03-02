const Sequelize = require('sequelize')

//connect to postgres server
const db = new Sequelize('testdb', 'postgres', 'rolwyn12345', {
    host:  'localhost',
    dialect: 'postgres',
    operatorsAlias: false,
    port: 3000,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})

module.exports = db;