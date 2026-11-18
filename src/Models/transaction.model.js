const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    type: {
      type: String,
      required: true,
      enum: ["Income", "Expense"],
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    attachment: {
      type: String,
      default: null,
    },

    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurringFrequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
      default: null,
    },

    nextOccurrence: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;
