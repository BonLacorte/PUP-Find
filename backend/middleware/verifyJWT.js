const jwt = require('jsonwebtoken')
const User = require("../models/User.js");
const asyncHandler = require('express-async-handler');

const verifyJWT = asyncHandler((req, res, next) => {
    // const authHeader = req.headers.token
    const authHeader = req.headers.token

    if (!authHeader?.startsWith('Bearer ')) {         // .startsWith('Bearer ')
        return res.status(401).json({ message: 'Unauthorized 11' })
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async(err, decoded) => {
            if (err) return res.status(403).json({ message: `Forbidden - ${err}` })
            req.user = await User.findById(decoded.UserInfo._id).select("-password");
            req.email = decoded.UserInfo.email
            req.id = decoded.UserInfo._id
            req.userInfo = decoded.UserInfo
            req.name = decoded.UserInfo.name
            req.isAdmin = decoded.UserInfo.isAdmin
            
            next()
        }
    )
})
    
    

module.exports = { verifyJWT } 