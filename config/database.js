const Sequelize = require('sequelize')
const fs = require('fs')
const caRds = fs.readFileSync(__dirname + '/us-east-1-bundle.pem');
require('dotenv').config()
const tls = require('tls')
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
            require: true,
            rejectUnauthorized: false,
            ca: [caRds],
            checkServerIdentity: (host, certificate) => {
                console.log('cert is')
                console.log(certificate)
                const err = tls.checkServerIdentity(host, certificate);
                if (err && !certificate.subject.CN.endsWith('.rds.amazonaws.com')) {
                    return err;
                }
            }
        }
    },
    pool: { maxConnections: 5, maxIdleTime: 30 }
})

module.exports = db;