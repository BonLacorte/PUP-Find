const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
const User = require("../models/User");
const LostItem = require("../models/LostItem")
const Message = require("../models/Message")

//@description     Create or fetch One to One Chat
//@route           POST http://localhost:3500/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res, next) => {
    // const { userId } = req.body;  // userId is the other user's id -- add the user's id here and substitute it to req.user._id

    // if other user's id is not sent with request

    console.log(req.user._id)
    const admin =  await User.findOne({ isAdmin: true });

    try {
        // Find chat that have these users: userId(admin), and req.user._id(client)  are
        const isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: admin._id } } },
            ],
        })
            .populate({
                path: "users",
                select: "-password",
            })
            .populate("latestMessage")
            // .populate({
            //     path: "lostItemProcesses",
            //     populate: [
            //         {
            //             path: "founderId",
            //             select: "name pic email phoneNumber facebookLink twitterLink membership specification",
            //         },
            //         {
            //             path: "ownerId",
            //             select: "name pic email phoneNumber facebookLink twitterLink membership specification",
            //         },
            //     ],
            // });

        // If there's no chat founded that contains userId(admin), and req.user._id(client), then create a new chat conversation
        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, admin._id],
            };
            
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("users", "-password")

            res.status(200).json(FullChat);
        }
    } catch (error) {
        console.log(error)
        next(error);
        throw new Error(error.message);
    }
});



//@description     add LostItem data to chat's lostItemProcesses
//@route           POST http://localhost:3500/chat/add-lostitem-processes
//@access          Protected
const addLostItemProcessesToChatData = asyncHandler(async (req, res, next) => {
    const { userId, lostItemId } = req.body;

    console.log(req.body);

    if (!userId || !lostItemId) {
        return res.sendStatus(400);
    }

    try {
        // Find chat that have these users: userId(admin), and req.user._id(client)  are
        let chat = await Chat.findOne({
            isGroupChat: false,
            $or: [
                { users: { $all: [req.user._id, userId] } },
                { users: { $all: [userId, req.user._id] } },
            ],
        }).populate("users", "-password");

        // If there's no chat founded that contains userId(admin), and req.user._id(client), then create a new chat conversation
        if (!chat) {
            chat = await Chat.create({
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            });
        }

        const lostItem = await LostItem.findById(lostItemId).exec();

        console.log('value of lostItem in chatController', lostItem);

        if (!lostItem) {
            return res.status(404).json({ message: "LostItem not found" });
        }

        // Update the reportStatus of the lost item to "Processing"
        lostItem.reportStatus = 'Processing';
        await lostItem.save();

        const existingLostItem = chat.lostItemProcesses.find(item => item.toString() === lostItemId);

        if (!existingLostItem) {
            chat.lostItemProcesses.push(lostItemId);
        }

        await chat.save();

        chat = await Chat.findById(chat._id)
            .populate("users", "-password")
            .populate({
                path: "lostItemProcesses",
                populate: [
                    {
                        path: "founderId",
                        select: "name pic email phoneNumber facebookLink twitterLink membership specification",
                    },
                    {
                        path: "ownerId",
                        select: "name pic email phoneNumber facebookLink twitterLink membership specification",
                    },
                ],
            })
            .populate("latestMessage");

        res.status(200).json(chat);
    } catch (error) {
        res.status(400).json({ message: "Server Error" });
        next(error);
    }
});



//@description     Fetch all chats for a user
//@route           GET http://localhost:3500/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        // .populate({
        //     path: "lostItemProcesses",
        //     populate: [
        //         {
        //             path: "founderId",
        //             select: "name pic email phoneNumber facebookLink twitterLink membership specification",
        //         },
        //         {
        //             path: "ownerId",
        //             select: "name pic email phoneNumber facebookLink twitterLink membership specification",
        //         },
        //     ],
        // })
        .sort({ updatedAt: -1 })
        .then(async (results) => {
            results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
            });
            res.status(200).send(results);
        });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


//@description     Update lastSeenMessage when a user sees a message
//@route           POST http://localhost:3500/chat/update-last-seen-message
//@access          Protected
const updateLastSeenMessage = asyncHandler(async (req, res, next) => {
    const { chatId, messageId, messageContent } = req.body;

    // console.log(req.body)
    if (!chatId || !messageId) {
    return res.sendStatus(400);
    }

    try {
        // Find the chat and message
        const chat = await Chat.findById(chatId);
        const message = await Message.findById(messageId);

        if (!chat || !message) {
            return res.sendStatus(404);
        }

        // Check if the user is part of the chat
        if (!chat.users.includes(req.user._id)) {
            return res.sendStatus(403);
        }

        // Update the lastSeenMessage for the user in the chat
        const userIndex = chat.lastSeenMessage.findIndex(
            (item) => item.user.toString() === req.user._id.toString()
        );

        if (userIndex !== -1) {
            // If the user already has a lastSeenMessage entry, update it
            chat.lastSeenMessage[userIndex].message = messageId;
            chat.lastSeenMessage[userIndex].content = messageContent;
            chat.lastSeenMessage[userIndex].timestamp = Date.now();
        } else {
            // If the user does not have a lastSeenMessage entry, add it
            chat.lastSeenMessage.push({
            user: req.user._id,
            message: messageId,
            content: messageContent,
            timestamp: Date.now(),
            });
        }

        // console.log(chat)
        
        // Save the updated chat
        await chat.save();
        res.status(200).json(chat)
    } catch (error) {
        res.status(400).json({ message: "Server Error" });
        next(error)
    }
});


//     //@description     Create New Group Chat
//     //@route           POST /api/chat/group
//     //@access          Protected
//     const createGroupChat = asyncHandler(async (req, res) => {
//     if (!req.body.users || !req.body.name) {
//         return res.status(400).send({ message: "Please Fill all the feilds" });
//     }

//     var users = JSON.parse(req.body.users);

//     if (users.length < 2) {
//         return res
//         .status(400)
//         .send("More than 2 users are required to form a group chat");
//     }

//     users.push(req.user);

//     try {
//         const groupChat = await Chat.create({
//         chatName: req.body.name,
//         users: users,
//         isGroupChat: true,
//         groupAdmin: req.user,
//         });

//         const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password");

//         res.status(200).json(fullGroupChat);
//     } catch (error) {
//         res.status(400);
//         throw new Error(error.message);
//     }
// });

// // @desc    Rename Group
// // @route   PUT /api/chat/rename
// // @access  Protected
// const renameGroup = asyncHandler(async (req, res) => {
//     const { chatId, chatName } = req.body;

//     const updatedChat = await Chat.findByIdAndUpdate(
//         chatId,
//         {
//             chatName: chatName,
//         },
//         {
//             new: true,
//         }
//     )
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password");

//     if (!updatedChat) {
//         res.status(404);
//         throw new Error("Chat Not Found");
//     } else {
//         res.json(updatedChat);
//     }
// });

// // @desc    Remove user from Group
// // @route   PUT /api/chat/groupremove
// // @access  Protected
// const removeFromGroup = asyncHandler(async (req, res) => {
//     const { chatId, userId } = req.body;

//     // check if the requester is admin

//     const removed = await Chat.findByIdAndUpdate(
//         chatId,
//         {
//             $pull: { users: userId },
//         },
//         {
//             new: true,
//         }
//     )
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password");

//     if (!removed) {
//         res.status(404);
//         throw new Error("Chat Not Found");
//     } else {
//         res.json(removed);
//     }
// });

// // @desc    Add user to Group / Leave
// // @route   PUT /api/chat/groupadd
// // @access  Protected
// const addToGroup = asyncHandler(async (req, res) => {
//     const { chatId, userId } = req.body;

//     // check if the requester is admin

//     const added = await Chat.findByIdAndUpdate(
//         chatId,
//         {
//             $push: { users: userId },
//         },
//         {
//             new: true,
//         }
//     )
//         .populate("users", "-password")
//         .populate("groupAdmin", "-password");

//     if (!added) {
//         res.status(404);
//         throw new Error("Chat Not Found");
//     } else {
//         res.json(added);
//     }
// });

    module.exports = {
    accessChat,
    addLostItemProcessesToChatData,
    fetchChats,
    updateLastSeenMessage,

    // createGroupChat,
    // renameGroup,
    // addToGroup,
    // removeFromGroup,
    };
