const jwt = require('jsonwebtoken')
const {expressjwt : expressJWT} = require('express-jwt')

exports.auth = (req, res, next) => {
    const { userId } = req.body
    if(!userId) {
        res.json({error : "ไม่พบข้อมูล"})
        return
    }
    // นำ userId มา
    if ( userId === process.env.LINE_USERID) {
        const token = jwt.sign({userId},
            process.env.LINE_USERID+process.env.MY_KEY,
            {expiresIn: '1d'})
        res.setHeader("Set-Cookie", "token=" + token)
        return
    } else {
        return res.status(400).json({error: "ข้อมูลไม่ถูกต้อง"})
    }
}

//ตรวจสอบ token
exports.requireAuth  = expressJWT({
    secret: process.env.LINE_USERID+process.env.MY_KEY,
    algorithms: ["HS256"],
    userProperty: "auth"
})