const express = require('express')
const router = express.Router()
const { auth } = require('../Controller/auth-controller');
const { create, getAllUsers, getUser, remove,
    updateLoad, updateActive, linkRichMenuToMyHome,
    linkRichMenuToMy99_1, updateUserProfile, unlinkRichMenuToUser
    , RichMenuAdmin
} = require('../Controller/user-controller')

router.post('/create', create) //สร้างข้อมูลผู้ใช้งาน
router.get('/users', getAllUsers) //ดึงข้อมูลผู้ใช้งานทั้งหมด
router.get('/user/:userId', getUser) //ดึงข้อมูลผู้ใช้งานเฉพาะ อ้างอิงจาก userId
router.delete('/user/:userId', remove) //ลบข้อมูลผู้ใช้งานเฉพาะ อ้างอิงจาก userId
router.put('/userUpdate/:userId', updateUserProfile) //อัปเดตข้อมูลผู้ใช้งาน อ้างอิงจาก userId

router.put('/RichMenuHome/0/:userId', RichMenuAdmin) //ลิงค์ริชเมนูให้ผู้ใช้งานบ้าน Admin อ้างอิงจาก userId
router.put('/RichMenuHome/1/:userId', linkRichMenuToMyHome) //ลิงค์ริชเมนูให้ผู้ใช้งานบ้าน 99 อ้างอิงจาก userId
router.put('/RichMenuHome/2/:userId', linkRichMenuToMy99_1) //ลิงค์ริชเมนูให้ผู้ใช้งานบ้าน 99 อ้างอิงจาก userId
router.put('/userUnlink/:userId', unlinkRichMenuToUser) //ลิงค์ริชเมนูให้กลับไปหน้า "รอ" โดยอ้างอิงจาก userId


module.exports = router