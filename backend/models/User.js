const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    uid: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    pic: {
      public_id: {
        type: String,
        default:
          null,
      },
      url: {
        type: String,
        required: true,
        default:
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
      },
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    phoneNumber: { type: String, default: null },
    facebookLink: { type: String, default: null },
    twitterLink: { type: String, default: null },
    membership:  { type: String, enum: ["Student", "Professor", "Staff"], default: null },
    specification: { type: String, default: null }
  },
  { timestamps: true }
);

// Middleware to remove related records before removing the user
userSchema.pre("remove", async function (next) {
  try {
    // Remove related Chat records
    await mongoose.model("Chat").deleteMany({ users: this._id });

    // Remove related Message records
    await mongoose.model("Message").deleteMany({ users: this._id });

    // Remove related Report records
    await mongoose.model("Report").deleteMany({ creatorId: this._id });

    // Remove related ClaimedReport records
    await mongoose.model("ClaimedReport").deleteMany({
      $or: [
        { foundReportId: { $in: this.reports } },
        { missingReportId: { $in: this.reports } },
      ],
    });

    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
