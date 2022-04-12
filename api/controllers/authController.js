const { response } = require('express')
const { signupuser, checkExistingUser, modifyUser } = require('../services/authService')
const User = require('../models/User')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')
const statsDClient = require('statsd-client')
const sdc = new statsDClient({ host: 'localhost', port: 8125 })

const logger = require('simple-node-logger').createSimpleLogger();
const awssdk = require("aws-sdk");
awssdk.config.update({region: 'us-east-1'});
const documentClient = new awssdk.DynamoDB.DocumentClient();
const crypto = require('crypto');

/**
 * Set a success response
 * 
 * @param {*} data take the response of the query and returns as JSON
 * @param {*} res server response if call is successful
 */
const setSuccessResponse = (data, res, successCode=200) => {
    res.status(successCode);
    res.json(data)
}

/**
 * Set a error response
 * 
 * @param {*} message the message if there is an error (returned from catch block)
 * @param {*} res will return 500 response status code if there is an error
 */
const setErrorResponse = (message, res, errCode=500) => {
    res.status(errCode);
    if (errCode == 500)
        res.json();
    res.json({ error: message });
}

/**
 * 
 * @param {req} req body
 * @param {res} the response to be sent 
 * @returns a success response json or error 
 */
const signup = async (req, res) => {
    try {
        sdc.increment('POST /v1/user');
        // express validator to check if errors
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return setErrorResponse(validationErrors.array(), res, 400)
        }
        // give bad request if the following fields are found
        if (req.body.account_created || req.body.account_updated || req.body.createdAt|| req.body.updatedAt || req.body.id) 
            return setErrorResponse(`Fields id, account_created, account_updated, updatedAt and createdAt are not accepted`, res, 400)

        // check if user exists
        const existingUser = await checkExistingUser(req.body.username)
        if (typeof existingUser === 'object' && existingUser !== null) 
            return setErrorResponse(`User already exists or there is some error`, res, 400)

        const user = {...req.body, password: bcrypt.hashSync(req.body.password, 8)}
        const newUser = await signupuser(user)

        // convert to json and return response without password
        const userData = newUser.toJSON()
        let {password, ...newUserData} = {...userData}
        setSuccessResponse(newUserData, res, 201)

        let emailID = req.body.username
        let token = crypto.randomBytes(16).toString("hex")
        ttlExpirationTime = Math.floor(Date.now() / 1000) + 120

        // Dynamo db add new token and email
        logger.info("Adding email and token to DynamoDB")
        logger.info('Email', emailID)
        logger.info('ttl', ttlExpirationTime)

        // body parameters for adding data
        let bodyParams = {
            TableName: "emailTokenTbl",
            Item: {
                emailid: emailID,
                token: token,
                ttl: ttlExpirationTime
            }
        }

        // put data in dynamodb
        documentClient.put(bodyParams, (err, data) => {
            if (err) {
                logger.info('error', err)
                console.log("Error in adding item to DynamoDB")
            }
            else {
                logger.info('data:', data)
                console.log(`Item added: ${data}`)
            }
        })

        // publish to SNS Topic and trigger lambda function
        let messageParams = {
            Message: 'USER_EMAIL_VERIFICATION',
            TopicArn: process.env.SNS_TOPIC_ARN,
            MessageAttributes: {
                'emailid': {
                    DataType: 'String',
                    StringValue: emailID
                },
                'token': {
                    DataType: 'String',
                    StringValue: token
                }
            }
        }

        let publishMessagePromise = new awssdk.SNS({apiVersion: '2010-03-31'}).publish(messageParams).promise();

        publishMessagePromise.then(
            function(data) {
                logger.info(data)
                console.log("Successfully published to sns topic")
                console.log("MessageID: " + data.MessageId);
            }).catch(
                function(err) {
                console.error(err, err.stack);
            })
    } catch (e) {
        setErrorResponse(e.message, res)
    }
};

const authenticate = async (req, res) => {
    try {
        sdc.increment('GET /v1/user/self');
        // the username and password from Basic Auth
        const requsername = req.credentials.name
        const reqpassword = req.credentials.pass

        // pass header username(email) to check if user exists
        const existingUser = await checkExistingUser(requsername.toLowerCase())
        if (existingUser == null) return setErrorResponse(`User not found`, res, 401)

        if (!existingUser.verified) return setErrorResponse(`User not verified`, res, 401)

        let isPasswordMatch = bcrypt.compareSync(
            reqpassword,
            existingUser.password
        );
 
        // if wrong password throw 401
        if (!isPasswordMatch) return setErrorResponse(`Credentials do not match`, res, 401)

        const userData = existingUser.toJSON()
        let {password, ...newUserData} = {...userData}

        setSuccessResponse(newUserData, res)
    } catch (e) {
        setErrorResponse(e.message, res)
    }
}

const updateUser = async (req, res) => {
    try {
        sdc.increment('PUT /v1/user/self');
        // if any validation fails
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return setErrorResponse(validationErrors.array(), res, 400)
        }
        
        // the username and password from Basic Auth
        const requsername = req.credentials.name
        const reqpassword = req.credentials.pass

        // pass header username(email) to check if user exists
        let existingUser = await checkExistingUser(requsername.toLowerCase())
        if (existingUser == null) return setErrorResponse(`User not found`, res, 401)

        if (!existingUser.verified) return setErrorResponse(`User not verified`, res, 401)

        let isPasswordMatch = bcrypt.compareSync(
            reqpassword,
            existingUser.password
        );
 
        // if wrong password throw 401
        if (!isPasswordMatch) return setErrorResponse(`Credentials do not match`, res, 401)

        // if the following field exists in request body throw Bad Request
        if (req.body.account_created || req.body.account_updated || req.body.createdAt|| req.body.updatedAt 
            || req.body.id || req.body.username) 
            return setErrorResponse(`{ Fields_not_allowed: id, username, account_created, account_updated, updatedAt and createdAt are not accepted }`, res, 400)
        
        // append the details to the authenticated user
        existingUser.firstname = req.body.firstname
        existingUser.lastname = req.body.lastname
        existingUser.password =  bcrypt.hashSync(req.body.password, 8)
        
        // call the modifyUser service
        const updateUser = await modifyUser(existingUser)
        setSuccessResponse('', res, 204)
        
    } catch (e) {
        setErrorResponse(e.message, res)
    }
}


const verifyUser = async (req, res) => {
    try {
        sdc.increment('GET /v1/verifyUserEmail');

        let useremail = req.query.email
        let token = req.query.token
        // pass header username(email) to check if user exists
        let existingUser = await checkExistingUser(useremail.toLowerCase())
        if (existingUser == null) return setErrorResponse(`User not found`, res, 401)

        // if user is already verified, then skip the rest
        if(existingUser.verified) return setErrorResponse(`Already verified`, res, 400)

        let getEmailParams = {
            TableName: 'emailTokenTbl',
            Key: {
                emailid: useremail
            }
        }

        documentClient.get(getEmailParams).promise()
            .then(function(data) {
                if (Object.keys(data).length === 1 && Math.floor(Date.now() / 1000) < data.Item.ttl && token === data.Item.token) {
                    // change user verifies status to true
                    logger.info(`Verified token is ${data.Item.token}`)
                    logger.info('data is: ', data)
                    existingUser.verified = true
                    existingUser.verified_on = Date.now()
                    // call the modifyUser service
                    const updateUser = modifyUser(existingUser)
                    setSuccessResponse('', res, 204)
                } else {
                    return setErrorResponse(`Token has expired, User cannot be verified`, res, 400)
                }
            })
            .catch(function(err) {
                return setErrorResponse(`Data for given emailid cannot be found`, res, 400)
            });
    } catch (e) {
        setErrorResponse(e.message, res)
    }
}

module.exports = {
    signup, authenticate, updateUser, verifyUser
}