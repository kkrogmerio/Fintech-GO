const mongoose = require("mongoose");

const fundsSchema = new mongoose.Schema(
  {
    category: {
      type: String,
    },
    variations: {
      type: [],
    },
    totalShares: {
      type: Number,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Funds", fundsSchema);
