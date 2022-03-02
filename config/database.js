const Sequelize = require('sequelize')

//connect to postgres server
const db = new Sequelize('postgres', 'postgres', 'rolwyn12345', {
    host:  process.env.PSQL_HOST,
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