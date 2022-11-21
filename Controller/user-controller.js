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

exports.updateUserProfile = (req, res) => {
    const { userId } = req.params
    axios({
        method: 'get',
        url: `https://api.line.me/v2/bot/profile/${userId}`,
        headers: {
            Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
        }
    })
    .then(response => {
        const {displayName, pictureUrl} = response.data
        console.log(response.data)
        User.findOneAndUpdate({userId}, {displayName: displayName, pictureUrl: pictureUrl}, {new:true})
        .exec((err, user) => {
            if(err) res.status(400).json({message: "มีบางอย่างผิดปกติตอนดึงข้อมูล"})
            res.json(user)
        })
    })
    .catch(err => {
        console.log(err)
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

exports.updateActive = (req, res) => {
    const { userId } = req.params
    const { userStatus } = req.body
    console.log(req.body);
    User.findOneAndUpdate({userId}, {userStatus: userStatus}, {new:true})
    .exec((err, user) => {
        if(err) res.status(400).json({message: "ลืมใส่ข้อมูล"})
        res.json(user)
    })
}

exports.updateLoad = (req, res) => {
    const { userId } = req.params
    const { userStatus } = req.body
    console.log(req.body);
    User.findOneAndUpdate({userId}, {userStatus: userStatus}, {new:true})
    .exec((err, user) => {
        if(err) res.status(400).json({message: "ลืมใส่ข้อมูล"})
        res.json(user)
    })
}

//บ้าน 99
exports.linkRichMenuToMyHome = (req, res) => {
    const { userId } = req.params
    User.findOneAndUpdate({userId: userId}, {userStatus: "99"})
    .exec((err, user) => {
        if (err) res.status(400).json({message: err})
        res.json(user)
    })
    lineBot.linkRichMenuToUser(userId, process.env.RICH_MENU_CONT99)
}

// บ้าน 99/1
exports.linkRichMenuToMy99_1 = (req, res) => {
    const { userId } = req.params
    User.findOneAndUpdate({userId: userId}, {userStatus: "99/1"})
    .exec((err, user) => {
        if (err) res.status(400).json({message: err})
        res.json(user)
    })
    lineBot.linkRichMenuToUser(userId, process.env.RICH_MENU_CONT99_1)
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