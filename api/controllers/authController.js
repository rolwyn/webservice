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
        // ttlExpirationTime = new Date().getTime() + 2*60*1000
        ttlExpirationTime = Math.floor(Date.now() / 1000) + 120

        // Dynamo db add new token and email
        logger.info("Adding email and token to DynamoDB")
        logger.info('Email', emailID)
        logger.info('ttl', ttlExpirationTime)
        let bodyParams = {
            TableName: "emailTokenTbl",
            Item: {
                emailid: emailID,
                token: token,
                ttl: ttlExpirationTime
            }
        }

        await documentClient.put(bodyParams, (err, data) => {
            if (err) {
                logger.info('error', err)
                console.log("Error in adding item to DynamoDB")
            }
            else {
                logger.info('data:', data)
                console.log(`Item added: ${data}`)
            }
        })

        // TopicArn: "arn:aws:sns:us-east-1:605680160689:UserVerificationTopic",
        logger.info('reached before messageParams')
        console.log('reached before messageParams')
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

        logger.info('reached after messageParams')
        logger.info('message is: ', messageParams)
        let publishMessagePromise = await new awssdk.SNS({apiVersion: '2010-03-31'}).publish(messageParams).promise();

        // publishMessagePromise.then((err, data) => {
        //     if (err) {
        //         logger.info('error:', err)
        //         console.log(err, err.stack);
        //     }
        //     else {
        //         logger.info("data as follows")
        //         logger.info(data)
        //         console.log(`Message sent to the topic ${messageParams.TopicArn} and data is ${data}`)
        //     }
        // })
        publishMessagePromise.then(
            function(data) {
                    // console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
                    console.log("MessageID is " + data.MessageId);
                    logger.info("data as follows")
                    logger.info(data)
                }).catch(
                    function(err) {
                    console.error(err, err.stack);
                })
        console.log('reached after publishMessagePromise')
        logger.info('reached after publishMessagePromise')

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
        let verificationToken = req.query.token
        // pass header username(email) to check if user exists
        let existingUser = await checkExistingUser(useremail.toLowerCase())
        if (existingUser == null) return setErrorResponse(`User not found`, res, 401)

        let getEmailParams = {
            TableName: 'emailTokenTbl',
            Key: {
                emailid: emailId
            }
        }

        documentClient.get(getEmailParams, (err, data) => {
            if (err) return setErrorResponse(`Data for given emailid cannot be found`, res, 400)
            console.log(data)
            if (Object.keys(data).length === 1 && Math.floor(Date.now() / 1000) < data.Item.ttl) {
                // change user verifies status to true
                existingUser.verified = true
                existingUser.verified_on = Date.now()
                // call the modifyUser service
                const updateUser = modifyUser(existingUser)
                setSuccessResponse('', res, 204)
            } else {
                return setErrorResponse(`Token has expired, User cannot be verified`, res, 400)
            }
        })
        
        
    } catch (e) {
        setErrorResponse(e.message, res)
    }
}

module.exports = {
    signup, authenticate, updateUser, verifyUser
}