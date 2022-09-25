// ติดต่อกับฐานข้อมูล / ดำเนินการกับฐานข้อมูล
require('dotenv').config()
const User = require("../models/user")
const axios = require('axios')
const line = require('@line/bot-sdk')

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
}

const lineBot = new line.Client(config);

exports.create = (req, res) => {
    const { nickName, userId, displayName, pictureUrl, userStatus } = req.body
    User.create({nickName, userId, displayName, pictureUrl, userStatus },
        (err, user) => {
            if (err) res.status(400).json({message: "มีบางอย่างผิดพลาด"})
            res.status(200).json(user)
    })
    lineBot.linkRichMenuToUser(userId, process.env.RICH_MENU_W8)
}

exports.getAllUsers = (req, res) => {
    User.find({}).exec((err, user) => {
        if(err) return res.status(400).json({message:"ไม่เจอข้อมูลลูกบ้าน สงสัยมีอะไรผิดตรงนี้"})
        res.json(user)
    })
}

exports.getUser = (req, res) => {
    const { userId } = req.params
    User.findOne({userId}).exec((err, user) => {
        res.json(user)
    })
}

exports.remove = (req, res) => {
    const { userId } = req.params
    User.findByIdAndDelete({userId}).exec((err, user) => {
        if (err) res.status(400).json({message: err})
        res.json({
            message: "ลบผู้ใช้เรียบร้อย"
        })
    })
}

exports.update = (req, res) => {
    const { userId } = req.params
    const { userStatus } = req.body
    if(userStatus === 'wait') {
        userStatus === 'Active'
        console.log(userStatus);
    } else {
        userStatus === "loading"
        console.log(userStatus);
    }
    User.findOneAndUpdate({userId}, {userStatus: userStatus}, {new:true})
    .exec((err, user) => {
        if(err) res.status(400).json({message: "ลืมใส่ข้อมูล"})
        res.json(user)
    })
}

//บ้าน 99
exports.linkRichMenuToMyHome = (req, res) => {
    const { userId } = req.params
    User.findOneAndUpdate({userId: userId}, {userStatus: "บ้านตาต้น"})
    .exec((err, user) => {
        if (err) res.status(400).json({message: err})
        lineBot.linkRichMenuToUser(userId, process.env.RICH_MENU_CONT99)
        res.json(user)
    })
}

// บ้าน 99/1
exports.linkRichMenuToMy99_1 = (req, res) => {
    const { userId } = req.params
    User.findOneAndUpdate({userId: userId}, {userStatus: "บ้านตาต้น"})
    .exec((err, user) => {
        if (err) res.status(400).json({message: err})
        lineBot.linkRichMenuToUser(userId, process.env.RICH_MENU_CONT99_1)
        res.json(user)
    })
}

//กลับไปหน้า Rich-Menu รอ
exports.unlinkRichMenuToUser = (req, res) => {
    const { userId } = req.params
    User.findOneAndUpdate({userId: userId}, {userStatus: "wait"})
    .exec((err, user) => {
        if (err) res.status(400).json({message: err})
        lineBot.linkRichMenuToUser(userId, process.env.RICH_MENU_W8)
        res.json(user)
    })
}