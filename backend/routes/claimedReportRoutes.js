const express = require('express')
const router = express.Router()
const claimedReportController = require('../controller/claimedReportController')
const {verifyJWT} = require('../middleware/verifyJWT')

router.route("/")
    .get(claimedReportController.getAllClaimedReport)
    .post(claimedReportController.createClaimedReport)

router.route("/:missingReportId/:foundReportId")
    .get(claimedReportController.getClaimedReportInfo)

router.route("/:claimedReportId")
    .get(claimedReportController.getClaimedReportById)
    .delete(claimedReportController.deleteClaimedReport)
    
module.exports = router