/**
 * performs a Http get request
 * @param {app} the express app 
 */
module.exports = function(app) {
    app.get('/healthz', (req, res) => {
        res.send('Health endpoint');
    });
}