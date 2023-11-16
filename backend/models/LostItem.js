// models/LostItem.js
const mongoose = require("mongoose");

const lostItemSchema = mongoose.Schema(
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
    dateFound: { type: Date, required: true },
    locationFound: { type: String, required: true },
    itemDescription: { type: String, required: true },
    founderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reportStatus: {
      type: String,
      enum: ["Missing", "Claimable", "Processing", "Claimed"],
      default: "Processing",
      required: true,
    },
    reportType: {
      type: String,
      enum: ["MissingItem", "FoundItem"],
      required: true,
    }
    
  },
  { timestamps: true }
);

const LostItem = mongoose.model("LostItem", lostItemSchema);
module.exports = LostItem;
