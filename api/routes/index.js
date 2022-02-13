const authRouter = require('./authRoute')

/**
 * performs a Http get request
 * @param {app} the express app 
 */
module.exports = function(app) {
    app.get('/healthz', (req, res) => {
        res.send('Health endpoint');
    });
    app.use('/v1', authRouter);
}