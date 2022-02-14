const bauth = require('basic-auth')

const basicAuth = (req, res, next) => {
    console.log("Reached to middleware")

    const userCredentials = bauth(req)

    console.log(userCredentials)

    if (!userCredentials) {
        res.status(401).setHeader('WWW-Authenticate', 'Basic realm="Access to User Data"').send('You are not Authorized')
    }

    req.credentials = userCredentials

    next()
}

module.exports = basicAuth