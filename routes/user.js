const express = require('express')
const router = express.Router()
const { create, getAllUsers, getUser, remove,
    updateLoad, updateActive, linkRichMenuToMyHome, linkRichMenuToMy99_1, 
    updateUserProfile
} =
    require('../Controller/user-controller')

router.post('/create', create)
router.get('/users', getAllUsers)
router.get('/user/:userId', getUser)
router.delete('/user/:userId', remove)
router.put('/userUpdate/:userId', updateUserProfile)
router.put('/userActive/:userId', linkRichMenuToMyHome)
router.put('/userLoad/:userId', linkRichMenuToMy99_1)

module.exports = router