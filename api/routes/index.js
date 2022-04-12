const authRouter = require('./authRoute')
const verifyUserRouter = require('./verifyUserRoute')
const statsDClient = require('statsd-client')
const sdc = new statsDClient({ host: 'localhost', port: 8125 })

/**
 * performs a Http get request
 * @param {app} the express app 
 */
module.exports = function(app) {
    app.get('/healthz', (req, res) => {
        sdc.increment('/healthz');
        res.json()
        // // res.sendStatus(200);
    });
    app.use('/v1/user', authRouter);
    app.use('/v1/verifyUserEmail', verifyUserRouter);
}
