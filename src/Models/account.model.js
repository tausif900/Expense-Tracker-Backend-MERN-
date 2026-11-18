const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    accountName: {
      type: String,
      required: true,
    },

    accountType: {
      type: String,
      required: true,
      enum: ["Cash", "Bank Account", "Credit Card", "Wallet", "Savings"],
    },

    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },
  },
  { timestamps: true },
);

const accountModel = mongoose.model("account", accountSchema);

module.exports = accountModel;
