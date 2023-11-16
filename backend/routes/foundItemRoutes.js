const express = require('express')
const router = express.Router()
const foundItemController = require('../controller/foundItemController')
const {verifyJWT} = require('../middleware/verifyJWT')

router.use(verifyJWT)

// router.route("/").get(chatController.fetchChats)
router.route("/")
    // .get(foundItemController.getAllLostItems)
    .post(foundItemController.createFoundItemReport)

router.route("/:id")
    // .put(foundItemController.updateLostItem)
    // .get(foundItemController.getLostItemInfo)

router.route('/:id/cancelProcess')
    // .put(foundItemController.cancelLostItemProcess);


router.route('/:id/finishProcess')
    // .put(foundItemController.finishLostItemProcess);
module.exports = router