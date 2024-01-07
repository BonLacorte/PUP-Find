const User = require('../models/User')
const Report = require('../models/Report')
const Message = require('../models/Message')
const Chat = require('../models/Chat')
const ClaimedReport = require('../models/ClaimedReport')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const cloudinary = require("../utils/cloudinary");

//@description     Get or Search all users
//@route           GET /user?search=
//@access          Public
const getAllUsers = asyncHandler(async (req, res) => {
    const { search, category } = req.query;

    const keywordFilter = search
        ? {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ],
        }
        : {};

    const categoryFilter = category ? { membership: category } : {};

    const filters = { ...keywordFilter, ...categoryFilter };

    const users = await User.find({ ...filters, _id: { $ne: req.user._id } });
    // // console.log(users)
    res.send(users);
});




// @desc Get user info in admin
// @route GET /user/:id
// @access Private
const getUserInfo = asyncHandler(async (req, res, next) => {
    try {
        // const { userId } = req.params
        // // console.log('getUserInfo', req.params)

        const user = await User.findById(req.params.userId).select('-password').lean().exec()

        // Confirm if user exists
        if(!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        return res.status(201).json(user)
    } 
    catch(error) {
        // console.log(error);
        next(error);
    }
})


// @desc Create new user
// @route POST /users
// @access Private
const createNewUserrr = asyncHandler(async (req, res, next) => {

    try {
        // console.log(req.body)
        const {
            name,
            email,
            uid,
            password,
            pic,
            membership,
            phoneNumber,
            specification,
            twitterLink,
            facebookLink,
        } = req.body;

        // Confirm data
        if (!name || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!pic || pic === '') {
            req.body.pic = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            // // console.log('Hello',req.body.pic)
        }

        // Check for duplicate email
        const duplicateEmail = await User.findOne({ email }).lean().exec();

        if (duplicateEmail) {
            return res.status(409).json({ message: "Email already used" });
        }
        // // console.log("duplicateEmail - passed")

        // Check for duplicate email
        const duplicateUid = await User.findOne({ uid }).lean().exec();

        if (duplicateUid) {
            return res.status(409).json({ message: "ID number already used" });
        }
        // // console.log("duplicateUid - passed")

        // Handle image upload if a new image is provided
        let picsLinks;

        if (pic !== "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg") {
            // Upload the image and get the secure URL
            // // console.log("hello1")
            const result = await cloudinary.uploader.upload(pic, {
                folder: "Users",
            });
            // // console.log("hello2")

            picsLinks = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        } else {
            // Use the default image URL
            picsLinks = {
                public_id: null,
                url:
                    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
            };
        }

        // Hash password
        const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

        // // console.log(`hashedPwd - ${hashedPwd}`)

        const newUser = {
            name,
            email,
            uid,
            password: hashedPwd,
            pic: picsLinks,
            membership,
            phoneNumber,
            specification,
            twitterLink,
            facebookLink,
        };

        // // console.log(`newUser - ${newUser}`)
        // Create and store the new user
        const user = await User.create(newUser);
        // // console.log(`Userrr - ${user}`)
        res.json(user);
    } catch (error) {
        // console.log(error);
        next(error);
    }
})


// @desc Update user profile
// @route PUT /users/:userId
// @access Private
const updateUserProfile = asyncHandler(async (req, res, next) => {
    // console.log(`req.body`,req.body)
    try {
        // Check if the user is authenticated by comparing the provided password with the stored hashed password
        const { password, ...updatedProfile } = req.body; // Remove password from the updatedProfile object
        const user = await User.findById(req.params.userId);
        // console.log(`user`,user)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the provided uid is the same as the user's uid
        if (user.uid !== updatedProfile.uid) {
            const duplicateUser = await User.findOne({ uid: updatedProfile.uid }).lean().exec();
            if (duplicateUser) {
                return res.status(409).json({ message: "UID is already used" });
            }
        }

        // Check if the provided email is different from the user's email
        if (user.email !== updatedProfile.email) {
            const duplicateEmail = await User.findOne({ email: updatedProfile.email }).lean().exec();
            // console.log(`duplicateEmail`,duplicateEmail)
            if (duplicateEmail) {
                return res.status(409).json({ message: "Email is already used" });
            }
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // If the password is correct, proceed with the profile update
        let picsLinks;

        // Handle image upload if a new image is provided
        if (updatedProfile.pic && updatedProfile.pic.length > 0) {
            if (user.pic !== undefined && user.pic.length > 0) {
                // Delete current picture
                await cloudinary.uploader.destroy(user.pic.public_id);
            }

            // Upload new picture to Cloudinary
            const result = await cloudinary.uploader.upload(updatedProfile.pic, {
                folder: 'Users',
            });

            picsLinks = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        } else {
            picsLinks = user.pic;
        }

        // Update user profile
        user.name = updatedProfile.name;
        user.email = updatedProfile.email;
        user.uid = updatedProfile.uid;
        user.phoneNumber = updatedProfile.phoneNumber;
        user.facebookLink = updatedProfile.facebookLink;
        user.twitterLink = updatedProfile.twitterLink;
        user.specification = updatedProfile.specification;
        user.membership = updatedProfile.membership;
        user.pic = picsLinks;

        // Save the updated user profile
        const updatedUser = await user.save();

        res.json(updatedUser);
    } catch (error) {
        // console.log(error);
        next(error);
    }
});


// @desc Delete User
// @route DELETE /users/:userId
// @access Private
const deleteUser = asyncHandler(async (req, res, next) => {
    try {
        // Does the user exist to delete?
        let user = await User.findById(req.params.userId)

        // Confirm if user exists
        if (!user) {
            return res.status(400).json({ message: 'User was not found' })
        }

        // // Show related Chat records to be deleted
        // const chatToDelete = await Chat.find({ users: user._id });
        // // console.log("Chat records to be deleted:", chatToDelete);

        // // Show related Message records to be deleted
        // const messagesToDelete = await Message.find({ sender: user._id });
        // // console.log("Message records to be deleted:", messagesToDelete);

        // // Show related Report records to be deleted
        // const reportsToDelete = await Report.find({ creatorId: user._id });
        // // console.log("Report records to be deleted:", reportsToDelete);

        // // Show related ClaimedReport records to be deleted
        // const claimedReportsToDelete = await ClaimedReport.find({
        //     $or: [
        //         { foundReportId: { $in: user.reports } },
        //         { missingReportId: { $in: user.reports } },
        //     ],
        // });
        // // console.log("ClaimedReport records to be deleted:", claimedReportsToDelete);

        // Delete the avatar from cloudinary
        if (user.pic.public_id) {
            await cloudinary.uploader.destroy(user.pic.public_id);
        }

        // Delete related Chat records
        await Chat.deleteMany({ users: user._id });

        // Delete related Message records
        await Message.deleteMany({ sender: user._id });

        // Delete related Report records
        await Report.deleteMany({ creatorId: user._id });

        // Delete related ClaimedReport records
        // await ClaimedReport.deleteMany({
        //     $or: [
        //         { foundReportId: { $in: user.reports } },
        //         { missingReportId: { $in: user.reports } },
        //     ],
        // });

        // Delete the user from the database
        await user.deleteOne()

        return res.status(200).json({ success: true });

    } catch (error) {
        // console.log(error);
        next(error);
    }
});


module.exports = {
    getAllUsers,
    createNewUserrr,
    getUserInfo,
    updateUserProfile,
    deleteUser
}