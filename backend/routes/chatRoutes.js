const express = require('express')
const router = express.Router()
const chatController = require('../controller/chatController')
const {verifyJWT} = require('../middleware/verifyJWT')

router.use(verifyJWT)

// router.route("/").get(chatController.fetchChats)
router.route("/")
    .get(chatController.fetchChats)
    .post(chatController.accessChat)

router.route("/add-lostitem-processes")
    .post(verifyJWT, chatController.addLostItemProcessesToChatData)

router.route("/update-last-seen-message")
    .post(verifyJWT, chatController.updateLastSeenMessage)

// router.route("/group")
//     .post(chatController.createGroupChat);

// router.route("/rename")
//     .put(chatController.renameGroup);

// router.route("/groupremove")
//     .put(chatController.removeFromGroup);

// router.route("/groupadd")
//     .put(chatController.addToGroup);

module.exports = router