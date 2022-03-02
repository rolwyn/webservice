const Sequelize = require('sequelize')

//connect to postgres server
const db = new Sequelize('testdb', 'postgres', 'rolwyn12345', {
    host:  process.env.PSQL_HOST  || "localhost" || "127.0.0.1",
    dialect: 'postgres',
    operatorsAlias: false,

    pool: {
        max: 100,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})

module.exports = db;