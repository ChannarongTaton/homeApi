const express = require('express')
const router = express.Router()
const { create, getAllUsers, getUser, remove, updateLoad, updateActive } = require('../Controller/user-controller')

router.post('/create', create)
router.get('/users', getAllUsers)
router.get('/user/:userId', getUser)
router.delete('/user/:userId', remove)
router.put('/userActive/:userId', updateActive)
router.put('/userLoad/:userId', updateLoad)

module.exports = router