const authRouter = require('./authRoute')

/**
 * performs a Http get request
 * @param {app} the express app 
 */
module.exports = function(app) {
    app.get('/heath', (req, res) => {
        res.json();
        // // res.sendStatus(200);
    });
    app.use('/v2/user', authRouter);
}