// models/LostItem.js
const mongoose = require("mongoose");

const reportSchema = mongoose.Schema(
    {
        itemName: { type: String, required: true },
        itemImage: [
            {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
        date: { type: Date, required: true },
        location: { type: String, required: true },
        itemDescription: { type: String, required: true },
        creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        reportStatus: {
            type: String,
            enum: ["Missing", "Claimable", "Processing", "Claimed"],
            default: "Processing",
            required: true,
        },
        reportType: {
            type: String,
            enum: ["MissingReport", "FoundReport"],
            required: true,
        }
        
    },
    { timestamps: true }
);

reportSchema.pre("remove", async function (next) {
    try {
      // Remove related ClaimedReport record
        await mongoose.model("ClaimedReport").deleteMany({
            $or: [
            { foundReportId: this._id },
            { missingReportId: this._id },
            ],
        });

        next();
    } catch (error) {
        next(error);
    }
});

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
