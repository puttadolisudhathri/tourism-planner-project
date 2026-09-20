
const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },

    destination: {
      type: String,
      required: true
    },

    touristPlaces: {
      type: [String],
      default: []
    },

    travelOption: {
      type: String,
      enum: ["Bus", "Train", "Flight", "Car"],
      required: true
    },

    days: {
      type: Number,
      required: true,
      min: 1
    },

    people: {
      type: Number,
      required: true,
      min: 1
    },

    foodCostPerPersonPerDay: {
      type: Number,
      required: true,
      min: 0
    },

    hotelCostPerDay: {
      type: Number,
      required: true,
      min: 0
    },

    transportCost: {
      type: Number,
      default: 0,
      min: 0
    },

    otherCost: {
      type: Number,
      default: 0,
      min: 0
    },

    totalBudget: {
      type: Number,
      required: true,
      min: 0
    },

    itinerary: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;