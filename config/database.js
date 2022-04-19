const Sequelize = require('sequelize')
const fs = require('fs')
require('dotenv').config()
//connect to postgres server

console.log(`${process.env.DB_NAME}`)
console.log(`${process.env.DB_USER_NAME}`)
console.log(`${process.env.DB_PASSWORD}`)
console.log(`${process.env.DB_ADDRESS}`)

const db = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER_NAME}`, `${process.env.DB_PASSWORD}`, {
    host:   `${process.env.DB_ADDRESS}`,
    port: 5432,
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
        ssl: {
            ca: fs.readFileSync('/global-bundle.pem').toString()
        }
    },
    pool: { maxConnections: 5, maxIdleTime: 30 }
})

module.exports = db;