const express = require('express')
const router = express.Router()
const lostItemController = require('../controller/lostItemController')
const {verifyJWT} = require('../middleware/verifyJWT')

router.use(verifyJWT)

// router.route("/").get(chatController.fetchChats)
router.route("/")
    .get(lostItemController.getAllLostItems)
    .post(lostItemController.createLostItem)

router.route("/:id")
    .put(lostItemController.updateLostItem)
    .get(lostItemController.getLostItemInfo)

router.route('/:id/cancelProcess')
    .put(lostItemController.cancelLostItemProcess);


router.route('/:id/finishProcess')
    .put(lostItemController.finishLostItemProcess);
module.exports = router