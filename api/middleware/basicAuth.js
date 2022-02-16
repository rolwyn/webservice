const bauth = require('basic-auth')

const basicAuth = (req, res, next) => {

    const userCredentials = bauth(req)

    if (!userCredentials) {
        return res.status(401).setHeader('WWW-Authenticate', 'Basic realm="Access to User Data"').send('You are not Authorized')
    }

    req.credentials = userCredentials

    next()
}

module.exports = basicAuth