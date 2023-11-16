const express = require('express')
const router = express.Router()
const dashboardController = require('../controller/dashboardController')
const {verifyJWT} = require('../middleware/verifyJWT')

// router.route("/").get(chatController.fetchChats)
router.route("/counts")
    .get(dashboardController.getReportCounts)

    router.route("/counts/:year")
    .get(dashboardController.getBarChartData)
    
module.exports = router