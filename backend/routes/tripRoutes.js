
const express = require("express");
const mongoose = require("mongoose");
const Trip = require("../models/Trip");

const router = express.Router();

// TEST ROUTE
router.get("/test", (req, res) => {
    res.json({
        message: "Trip route is working!"
    });
});

// CREATE A TRIP
router.post("/", async (req, res) => {
    try {
        const trip = new Trip(req.body);

        const savedTrip = await trip.save();

        res.status(201).json({
            message: "Trip created successfully",
            trip: savedTrip
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: "Error creating trip",
            error: error.message
        });
    }
});

// GET ALL TRIPS
router.get("/", async (req, res) => {
    try {
        const trips = await Trip.find().sort({
            createdAt: -1
        });

        res.status(200).json(trips);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error fetching trips"
        });
    }
});

// GET ONE TRIP BY ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid trip ID"
            });
        }

        const trip = await Trip.findById(id);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        res.status(200).json(trip);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error fetching trip"
        });
    }
});

// UPDATE A TRIP
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid trip ID"
            });
        }

        const updatedTrip = await Trip.findByIdAndUpdate(
            id,
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
        console.error(error);

        res.status(400).json({
            message: "Error updating trip",
            error: error.message
        });
    }
});

// DELETE A TRIP
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid trip ID"
            });
        }

        const deletedTrip = await Trip.findByIdAndDelete(id);

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
        console.error(error);

        res.status(500).json({
            message: "Error deleting trip"
        });
    }
});

module.exports = router;