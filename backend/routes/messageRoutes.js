const express = require("express");
const router = express.Router();
const messageControllers = require("../controller/messageController");
const { verifyJWT } = require("../middleware/verifyJWT");

router.use(verifyJWT)

router.route("/:chatId")
    .get(messageControllers.allMessages);
router.route("/")
    .post(messageControllers.sendMessage);

module.exports = router;