const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const cloudinary = require("../config/cloudinary");

// @desc Create new user
// @route POST /users
// @access Private
const register = asyncHandler(async (req, res, next) => {

    const { name, email, password,  } = req.body

    // Confirm data
    if (!name || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate email
    const duplicate = await User.findOne({ email }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate email' })
    }

    // console.log(req.body.pic)
    
    try {
        // Uploading avatar
        let pic;

        // If req.body.pic is not empty, upload to cloudinary
        if (req.body.pic !== undefined) {
            
            const result = await cloudinary.uploader.upload(req.body.pic, {
                folder: "users",
            });

            pic = result.secure_url
        }
        else { // If req.body.pic is empty, put the default link
            pic = 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
        }

        req.body.pic = pic;

        // Hash password 
        const hashedPwd = await bcrypt.hash(password, 10) // salt rounds
        req.body.password = hashedPwd;

        // Create and store new user 
        const user = await User.create(req.body)

        // if (user) {
        //     return res.status(201).json({
        //         _id: user._id,
        //         name: user.name,
        //         email: user.email,
        //         pic: user.pic,
        //         isAdmin: user.isAdmin,
        //     })
        // }
                

        res.status(201).json({ 
            success: true, 
            user
        })
        
    } catch (error) {
        // console.log(error);
        next(error);
    }
})


// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res, next) => {
    
    try {
        // // console.log(req.body)
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const foundUser = await User.findOne({ email }).exec()

        if (!foundUser) {                                                                 // CHANGE THIS, BASED ON WHAT WE WILL INCLUDE IN THE USER MODEL
            return res.status(401).json({ message: `Unauthorized Hello1 ${email}, ${password} ` })
        }

        const match = await bcrypt.compare(password, foundUser.password)
        // // console.log(email, password, match)
        if (!match) {
            return res.status(401).json({ message: `Unauthorized Wrong Password ${email}, ${password} ` })
        } 

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "_id": foundUser._id,
                    "name": foundUser.name,
                    "email": foundUser.email,
                    "isAdmin": foundUser.isAdmin,
                    "pic": foundUser.pic,
                    "uid": foundUser.uid
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        const refreshToken = jwt.sign(
            { 
                "email": foundUser.email,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )

        // Create secure cookie with refresh token 
        res.cookie('jwt', refreshToken, {
            httpOnly: true, //accessible only by web server 
            secure: true, //https
            sameSite: 'None', //cross-site cookie 
            maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
        })

        // const { password, ...others } = foundUser._doc;
        // res.status(200).json({ message: 'Login successful', others})

        // Send accessToken containing username and roles 
        res.json({ 
            _id: foundUser._id,
            name: foundUser.name,
            email: foundUser.email,
            isAdmin: foundUser.isAdmin,
            pic: foundUser.pic, 
            uid: foundUser.uid,
            accessToken})
        // // console.log(process.env.REFRESH_TOKEN_SECRET)
        
    
    } catch (error) {
        // console.log(error);
        next(error);    
    }
})

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res, next) => {
    try {
        const cookies = req.cookies
        // console.log(cookies)
        // console.log("cookies hello")
        if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized 1' })

        const refreshToken = cookies.jwt

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            asyncHandler(async (err, decoded) => {
                if (err) return res.status(403).json({ message: 'Forbidden' })

                const foundUser = await User.findOne({ email: decoded.email }).exec()

                if (!foundUser) return res.status(401).json({ message: 'Unauthorized 2' })

                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "_id": foundUser._id,
                            "name": foundUser.name,
                            "email": foundUser.email,
                            "isAdmin": foundUser.isAdmin,
                            "pic": foundUser.pic,
                            "uid": foundUser.uid
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1d' }
                )

                res.json({ accessToken })
            })
        )
    } catch (error) {
        //// console.log(error);
        next(`${error} - hello`);
    }
    
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    // console.log(cookies)
    // console.log("cookies hello")
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout, 
    register
}