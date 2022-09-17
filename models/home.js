// สถานะหลอดไฟบ่อปลา (), สถานะไฟหน้าบ้าน (), สถานะประตู ()
const mongoose = require('mongoose')
const homeSchema = mongoose.Schema({
    id: String,                                     // รหัสอุปกรณ์
    name: String,                                   // ชื่ออุปกรณ์
    activeWhen: {type: Date, default: Date.now},    // ทำงานล่าสุดเมื่อไหร่
    userActive: String,                             //ชื่อคนใช้งานล่าสุด
    isActive: Boolean                               //สถานะ
    // slidingGate,
},{timestamps:true})

module.exports = mongoose.model("Home_DB",homeSchema)