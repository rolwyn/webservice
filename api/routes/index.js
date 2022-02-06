module.exports = function(app) {
    app.get('/healthz', (req, res) => {
        res.send('Health endpoint');
    });
}