const { response } = require('express')
const { signupuser, checkExistingUser, modifyUser } = require('../services/authService')
const { saveUserImg, getExistingFile, deleteExistingFile } = require('../services/fileService')
const User = require('../models/User')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')
const awssdk = require("aws-sdk")
const multer = require("multer")
const multerS3 = require("multer-s3")
require('dotenv').config()

const s3 = new awssdk.S3({apiVersion: "2006-03-01"})

const statsDClient = require('statsd-client')
const sdc = new statsDClient({ host: 'localhost', port: 8125 })
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
    else if (errCode == 404)
        res.json();
    else res.json({ error: message });
}

const fileUpload = async (req, res) => {
    sdc.increment('POST /v1/user/self/pic');
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

    let getUserImg = await getExistingFile(existingUser.id)
        .then(function(imgdata) {
            if (imgdata) {
                s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: imgdata.url }, (err, data) => {
                    if (err) {
                        console.error(`Error in deleting from bucket - ${err}`);
                        setErrorResponse(`${err}`, res)
                    }  else {
                        imgdata.destroy()
                    }
                });
            }
        })

    const fileTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg'
    ]
    
    let uploadFileToBucket = multer({
        storage: multerS3({
            acl: "private",
            s3: s3,
            bucket: process.env.AWS_BUCKET_NAME,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                path = `${process.env.AWS_BUCKET_NAME}/${existingUser.id}/${file.originalname}`
                cb(null, path);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!fileTypes.includes(file.mimetype))
                return cb(new Error('File type is not valid'))
            cb(null, true)
        }
    })
    .single("imagefile")
    
    await uploadFileToBucket(req, res, async err => {
        if (err) return setErrorResponse(`Only JPEG, JPG and PNG format accepted`, res, 400)

        if (req.file) {
            const imgData = {
                file_name: req.file.originalname,
                user_id: existingUser.id,
                url: req.file.key
            }
            let userImg;
            let userImageData = await saveUserImg(imgData)
                .then(function(data) {
                    userImg = data.toJSON()
                    setSuccessResponse('Profile pic added/updated', res, 201)
                })
                .catch(error => {
                    return setErrorResponse(`Error`, res, 400)
                });
        } else {
            return setErrorResponse(`File is not selected`, res, 400)
        }
    })
}

const getFile = async (req, res) => {
    try {
        sdc.increment('GET /v1/user/self/pic');
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

        let getUserImg = await getExistingFile(existingUser.id)
        if (getUserImg == null) return setErrorResponse('', res, 404)

        const userImgData = getUserImg.toJSON()
        let {update_date, ...newUserImgData} = {...userImgData}

        setSuccessResponse(newUserImgData, res)
    } catch (e) {
        setErrorResponse(e.message, res)
    }
}


const deleteFile = async (req, res) => {
    try {
        sdc.increment('DELETE /v1/user/self/pic');
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

        let getUserImg = await getExistingFile(existingUser.id)
        if (getUserImg == null) return setErrorResponse('', res, 404)

        s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: getUserImg.url }, async (err, data) => {
            if (err) console.error(`Error in deleting from bucket - ${err}`);
            console.log('deleted data ---->')
            console.log(data)
            if (Object.keys(data).length === 0) {
                const deleteFile = await deleteExistingFile(existingUser.id)
                setSuccessResponse('', res, 204)
            }
        });

    } catch (e) {
        setErrorResponse(e.message, res)
    }
}

module.exports = {
    fileUpload, getFile, deleteFile
}