// ติดต่อกับฐานข้อมูล / ดำเนินการกับฐานข้อมูล
const slugify = require('slugify')
const Home = require("../models/home")
const { v4 : uuidv4 } = require('uuid')
const mqtt = require('mqtt')
const request = require('request');
const { default: axios } = require('axios')
require('dotenv').config()

const clientMqtt = mqtt.connect({
    host: process.env.HOSTMQTT_DOOR,
    port: 1883,
})

const url_line_notification = "https://notify-api.line.me/api/notify";

exports.create = (req, res) => {
    const {id, name, activeWhen, userActive, isActive} = req.body
    let slug = slugify(name);

    if(!slug) slug=uuidv4();

    switch(true){
        case !id:
            return res.status(400).json({error: "กรุณาป้อนหมายเลข id"})
            break;
        case !name:
            return res.status(400).json({error: "กรุณาป้อนชื่ออุปกรณ์"})
            break;
    }
    Home.create({id, name, activeWhen, userActive, isActive}, (err, home) => {
        if (err) {
            res.status(400).json({error: "มีชื่อหมายเลขซ้ำกัน"})
        }
        res.json(home)
    })
}


exports.getAllItems = (req, res) => {
    Home.find({}).exec((err, home) => {
        if(err) return res.status(400).json({message:"ไม่เจออุปกรณ์ สงสัยมีอะไรผิดตรงนี้"})
        res.json(home)
    })
}

exports.getItem = (req, res) => {
    const { id } = req.params;
    Home.findOne({id}).exec((err, home) => {
        if (err) res.status(400).json({message: `เหมือนว่าจะหา ${id} ไม่เจอนะ`})
        res.json(home)
    })
}

exports.remove = (req, res) => {
    const { id } = req.params;
    console.log(id);
    Home.findOneAndRemove({id}).exec((err, home) => {
        if (err) res.status(400).json({message: `เหมือนว่าจะมีอะไรแปลกๆตอนลบ`})
        res.json({message: `ลบอุปกรณ์ตัวที่ ${id} เรียบร้อย`})
    })
}

exports.update = (req,res) => {
    const { id } = req.params
    const { active, lineName } = req.body
    request({
        method: 'POST',
        uri: url_line_notification,
        header: {
            'Content-Type': 'multipart/form-data',
        },
        auth: {
            bearer: process.env.LINE_TOKEN,
        },
        form: {
            message: ` ${lineName} สั่งทำงานอุปกรณ์`
        },
    }, (err, httpResponse, body) => {
        if (err) {
            console.log(JSON.stringify(err))
        } else {
            console.log(JSON.stringify(httpResponse))
            console.log(JSON.stringify(body))
        }
    });
    Home.findOneAndUpdate({id}, {isActive: !active, userActive: lineName})
    .exec((err, home) => {
        if(err) console.log(err)
        res.status(200).json(home)
    })
    mqttMsg(id, active);
}

function mqttMsg(id, active) {
    if (id == 1 && active == true) {
        return clientMqtt.publish(process.env.SUB_TOPIC_LAMP, process.env.PUB_ON_fHome)
    } else if (id == 1 && active == false) {
        return clientMqtt.publish(process.env.SUB_TOPIC_LAMP, process.env.PUB_OFF_fHome)
    } else if (id == 2 && active == true) {
        return clientMqtt.publish(process.env.SUB_TOPIC_LAMP, process.env.PUB_ON_pHome)
    } else if (id == 2 && active == false) {
        return clientMqtt.publish(process.env.SUB_TOPIC_LAMP, process.env.PUB_OFF_pHome)
    } else if(id == 3 && active == true) {
        clientMqtt.publish(process.env.SUB_TOPIC_DOOR, process.env.PUB_ON_DOOR)
    } else if (id == 3 && active == false) {
        clientMqtt.publish(process.env.SUB_TOPIC_DOOR, process.env.PUB_OFF_DOOR)
    }
}
