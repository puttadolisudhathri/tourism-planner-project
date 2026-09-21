const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    destinationId: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: false,
      trim: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      required: false,
      trim: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },

    feedback: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;