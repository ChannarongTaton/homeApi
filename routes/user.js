const express = require('express')
const router = express.Router()
const { create, getAllUsers, getUser, remove, update } = require('../Controller/user-controller')

router.post('/create', create)
router.get('/users', getAllUsers)
router.get('/user/:userId', getUser)
router.delete('/user/:userId', remove)
router.put('/user/:userId', update)

module.exports = router