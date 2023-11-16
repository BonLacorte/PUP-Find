const express = require('express')
const router = express.Router()
const reportController = require('../controller/reportController')
const { verifyJWT } = require('../middleware/verifyJWT')

// router.use(verifyJWT)

router.route("/")
    .get(reportController.getAllReports)
    .post(reportController.createReport)

router.route("/:reportId")
    .put(reportController.updateReport) // check
    .get(reportController.getReportInfo)
    .delete(reportController.deleteReport)

    router.route("/creator/:uid")
    .get(reportController.getAllReportsByUser)

module.exports = router;