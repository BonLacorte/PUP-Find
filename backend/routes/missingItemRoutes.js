const express = require('express')
const router = express.Router()
const missingItemController = require('../controller/missingItemController')
const {verifyJWT} = require('../middleware/verifyJWT')

router.use(verifyJWT)

// router.route("/").get(chatController.fetchChats)
router.route("/")
    // .get(missingItemController.getAllLostItems)
    .post(missingItemController.createMissingItemReport)

router.route("/:id")
    // .put(missingItemController.updateLostItem)
    // .get(missingItemController.getLostItemInfo)

router.route('/:id/cancelProcess')
    // .put(missingItemController.cancelLostItemProcess);


router.route('/:id/finishProcess')
    // .put(missingItemController.finishLostItemProcess);
module.exports = router