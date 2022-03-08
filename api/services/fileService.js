const UserPic = require('../models/UserImage')

const saveUserImg = (imgData) => {
    return UserPic.create(imgData)
}

const getExistingFile = (userid) => {
    return UserPic.findOne({ where: { user_id: userid } })
}

const deleteExistingFile = (userid) => {
    return UserPic.destroy({ where: { user_id: userid } })
}

module.exports = {saveUserImg, getExistingFile, deleteExistingFile}

