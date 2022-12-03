// ติดต่อกับฐานข้อมูล / ดำเนินการกับฐานข้อมูล
require('dotenv').config()
const User = require("../models/user")
const axios = require('axios')
const line = require('@line/bot-sdk')
const jwt = require("jsonwebtoken");
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
}
//สร้างตัวแปรรับคลาสจาก ไรบราลี่
const lineBot = new line.Client(config);
//บันทึกข้อมูลของสมาชิกลงฐานข้อมูล แล้วลิ้งค์ริชเมนูให้รอการยืนยันจากระบบไปแก้ ผู้สมัคร
exports.create = (req, res) => {
    const { nickName, userId, displayName, pictureUrl, userStatus } = req.body
    User.create({nickName, userId, displayName, pictureUrl, userStatus },
        (err, user) => {
            if (err) res.status(400).json({
                message: "มีบางอย่างผิดพลาด"
            })
            return res.status(201).json({
                message: `สร้างข้อมูล ${userId} เรียบร้อย`
            })
        })
    lineBot.linkRichMenuToUser(userId, process.env.RICH_MENU_W8)
}
//เรียกใช้ข้อมูลผู้ใช้จากฐานข้อมูลทั้งหมด
exports.getAllUsers = (req, res) => {
    User.find({}).exec((err, user) => {
        if(err) return res.status(400).json({
            message:"ไม่เจอข้อมูลลูกบ้าน สงสัยมีอะไรผิดตรงนี้"
        })
        if (!user) return res.status(400).json({
            message : "ไม่พบข้อมูลลูกบ้าน"
        })
        return res.json(user)
    })
}
//ดึงข้อมูลเฉพาะผู้ใช้บางคนจาก userId
exports.getUser = (req, res) => {
    const { userId } = req.params
    User.findOne({userId}).exec((err, user) => {
        if (err) return res.status(400).json({
            message : `error`
        })
        if (!user) return res.status(404).json({
            message: `ไม่พบข้อมูล`
        })
        return res.status(200).json(user)
    })
}
//อัปเดตข้อมูลโปรไฟล์ผู้ใช้งานคนนั้น อ้างอิงจาก userId
exports.updateUserProfile = (req, res) => {
    const { userId } = req.params
    //ใช้ axios ในการดึงข้อมูลผู้ใช้
    axios({
        method: 'get',
        url: `https://api.line.me/v2/bot/profile/${userId}`,
        headers: {
            Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
        }
    })
    .then(response => {//จากนั้นหาข้อมูลผู้ใช้ในฐานข้อมูลและอัปเดตแทนข้อมูลเดิม
        const {displayName, pictureUrl} = response.data
        User.findOneAndUpdate({userId}, {
            displayName: displayName,
            pictureUrl: pictureUrl
        },
        {new:true})
        .exec((err, user) => {
            if(err) res.status(400).json({
                message: "มีบางอย่างผิดปกติตอนดึงข้อมูล"
            })
            return res.status(200).json({
                message: `อัปเดตข้อมูลของ ${user.displayName}`
            })
        })
    })
    .catch(err => {
        console.log(err)
    })
}
//ลบข้อมูลผู้ใช้โดยอ้างอิงจาก userId
exports.remove = (req, res) => {
    const { userId } = req.params
    User.findByIdAndDelete({userId}).exec((err, user) => {
        if (err) res.status(400).json({
            message: err
        })
        return res.status(200).json({
            message: "ลบผู้ใช้เรียบร้อย"
        })
    })
}
//อัปเดตข้อมูลผู้ใช้โดยข้างอิงจาก userId และอัปเดตสถานะของลูกบ้าน
exports.updateActive = (req, res) => {
    const { userId } = req.params
    const { userStatus } = req.body
    console.log(req.body);
    User.findOneAndUpdate({userId}, {
        userStatus: userStatus
    },
    {new:true})
    .exec((err, user) => {
        if(err) res.status(400).json({
            message: "ลืมใส่ข้อมูล"
        })
        return res.status(200).json(user)
    })
}
//อัปเดตข้อมูลผู้ใช้โดยข้างอิงจาก userId และอัปเดตสถานะของลูกบ้าน
exports.updateLoad = (req, res) => {
    const { userId } = req.params
    const { userStatus } = req.body
    console.log(req.body);
    User.findOneAndUpdate({userId}, {
        userStatus: userStatus
    },
    {new:true})
    .exec((err, user) => {
        if(err) res.status(400).json({
            message: "ลืมใส่ข้อมูล"
        })
        return res.status(200).json(user)
    })
}

exports.RichMenuAdmin = (req, res) => {
    const { userId } = req.params
    User.findOneAndUpdate({userId: userId}, {
        userStatus: "Admin"
    })
    .exec((err, user) => {
        if (err) res.status(400).json({
            error: err
        })
        return res.status(200).json({
            message: `ปรับสถานะของคุณ ${userId} เป็น Admin`
        })
    })
    lineBot.linkRichMenuToUser(userId, process.env.RICH_MENU_ADMIN)
}

//ลิงค์ริชเมนูให้ผู้ใช้งานบ้าน 99 อ้างอิงจาก userId
exports.linkRichMenuToMyHome = (req, res) => {
    const { userId } = req.params
    if (userId === process.env.LINE_USERID) {
        return res.status(400).json({
            error: "ไม่สามารถแก้สถานะของ เทพต้นได้"
        })
    }
    User.findOneAndUpdate({userId: userId}, {
        userStatus: "99"
    })
    .exec((err, user) => {
        if (err) res.status(400).json({
            message: err
        })
        return res.status(200).json({
            message: `ปรับบ้านเลขที่ของ ${userId} เป็น 99 เรียบร้อยแล้ว`
        })
    })
    lineBot.linkRichMenuToUser(userId, process.env.RICH_MENU_CONT99)
}

//ลิงค์ริชเมนูให้ผู้ใช้งานบ้าน 99/1 อ้างอิงจาก userId
exports.linkRichMenuToMy99_1 = (req, res) => {
    const { userId } = req.params
    if (userId === process.env.LINE_USERID) {
        return res.status(400).json({
            error: "ไม่สามารถแก้สถานะของ เทพต้นได้"
        })
    }
    User.findOneAndUpdate({userId: userId}, {
        userStatus: "99/1"
    })
    .exec((err, user) => {
        if (err) res.status(400).json({
            message: err
        })
        return res.status(200).json({
            message: `ปรับบ้านเลขที่ของ ${userId} เป็น 99/1 เรียบร้อยแล้ว`
        })
    })
    lineBot.linkRichMenuToUser(userId, process.env.RICH_MENU_CONT99_1)
}

//ลิงค์ริชเมนูให้กลับไปหน้า "รอ" โดยอ้างอิงจาก userId
exports.unlinkRichMenuToUser = (req, res) => {
    const { userId } = req.params
    if (userId === process.env.LINE_USERID) {
        return res.status(400).json({
            error: "ไม่สามารถแก้สถานะของ เทพต้นได้"
        })
    }
    User.findOneAndUpdate({userId: userId}, {
        userStatus: "wait"
    })
    .exec((err, user) => {
        if (err) res.status(400).json({
            message: err
        })
        lineBot.linkRichMenuToUser(userId, process.env.RICH_MENU_W8)
        return res.status(200).json(user)
    })
}