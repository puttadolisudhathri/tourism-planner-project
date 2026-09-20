
const express = require("express");
const mongoose = require("mongoose");
const Trip = require("../models/Trip");

const router = express.Router();

// ==========================================
// 1. CALCULATE BUDGET
// ==========================================

router.post("/calculate-budget", (req, res) => {
  try {
    const {
      days,
      people,
      foodCostPerPersonPerDay,
      hotelCostPerDay,
      transportCost,
      otherCost
    } = req.body;

    if (
      days === undefined ||
      people === undefined ||
      foodCostPerPersonPerDay === undefined ||
      hotelCostPerDay === undefined
    ) {
      return res.status(400).json({
        message: "Required budget details are missing"
      });
    }

    const foodCost =
      Number(days) *
      Number(people) *
      Number(foodCostPerPersonPerDay);

    const hotelCost =
      Number(days) *
      Number(hotelCostPerDay);

    const finalTransportCost = Number(transportCost || 0);
    const finalOtherCost = Number(otherCost || 0);

    const totalBudget =
      foodCost +
      hotelCost +
      finalTransportCost +
      finalOtherCost;

    res.status(200).json({
      message: "Budget calculated successfully",
      calculation: {
        foodCost,
        hotelCost,
        transportCost: finalTransportCost,
        otherCost: finalOtherCost,
        totalBudget
      }
    });
  } catch (error) {
    console.error("Budget calculation error:", error.message);

    res.status(500).json({
      message: "Error calculating budget",
      error: error.message
    });
  }
});

// ==========================================
// 2. SAVE TRIP
// ==========================================

router.post("/", async (req, res) => {
  try {
    console.log("Received trip data:", req.body);

    const trip = new Trip(req.body);

    const savedTrip = await trip.save();

    res.status(201).json({
      message: "Trip saved successfully",
      trip: savedTrip
    });
  } catch (error) {
    console.error("Save trip error:", error.message);

    res.status(500).json({
      message: "Error saving trip",
      error: error.message
    });
  }
});

// ==========================================
// 3. GET ALL TRIPS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find().sort({
      createdAt: -1
    });

    res.status(200).json(trips);
  } catch (error) {
    console.error("Fetch trips error:", error.message);

    res.status(500).json({
      message: "Error fetching trips",
      error: error.message
    });
  }
});

// ==========================================
// 4. GET ONE TRIP
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid trip ID"
      });
    }

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error("Fetch single trip error:", error.message);

    res.status(500).json({
      message: "Error fetching trip",
      error: error.message
    });
  }
});

// ==========================================
// 5. UPDATE TRIP
// ==========================================

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid trip ID"
      });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedTrip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    res.status(200).json({
      message: "Trip updated successfully",
      trip: updatedTrip
    });
  } catch (error) {
    console.error("Update trip error:", error.message);

    res.status(500).json({
      message: "Error updating trip",
      error: error.message
    });
  }
});

// ==========================================
// 6. DELETE TRIP
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid trip ID"
      });
    }

    const deletedTrip = await Trip.findByIdAndDelete(
      req.params.id
    );

    if (!deletedTrip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    res.status(200).json({
      message: "Trip deleted successfully",
      trip: deletedTrip
    });
  } catch (error) {
    console.error("Delete trip error:", error.message);

    res.status(500).json({
      message: "Error deleting trip",
      error: error.message
    });
  }
});

module.exports = router;