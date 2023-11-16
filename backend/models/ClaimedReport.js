// models/ClaimedReport.js
const mongoose = require("mongoose");

const claimedReportSchema = mongoose.Schema(
    {
        foundReportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report", required: true  },
        missingReportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report", required: true  },
    },
    { timestamps: true }
);

const claimedReport = mongoose.model("ClaimedReport", claimedReportSchema);
module.exports = claimedReport;
