const express = require('express')
const router = express.Router()
const { create, getAllItems, getItem, remove, update} = require('../Controller/home-controller')

router.post('/create', create);
router.get('/Items', getAllItems);
router.get('/Item/:id', getItem);
router.delete('/Item/:id', remove);
router.put('/Change-state/:id', update);
module.exports = router