
const express = require("express");
const mongoose = require("mongoose");
const Destination = require("../models/Destination");

const router = express.Router();

// TEST ROUTE
router.get("/test", (req, res) => {
    res.json({
        message: "Destination route is working!"
    });
});

// GET ALL DESTINATIONS
router.get("/", async (req, res) => {
    try {
        const destinations = await Destination.find();

        res.status(200).json(destinations);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error fetching destinations"
        });
    }
});

// GET ONE DESTINATION BY ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid destination ID"
            });
        }

        const destination = await Destination.findById(id);

        if (!destination) {
            return res.status(404).json({
                message: "Destination not found"
            });
        }

        res.status(200).json(destination);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error fetching destination"
        });
    }
});

// ADD DESTINATION
router.post("/", async (req, res) => {
    try {
        const {
            name,
            location,
            description,
            image,
            touristPlaces
        } = req.body;

        if (!name || !location || !description || !image) {
            return res.status(400).json({
                message: "Name, location, description and image are required"
            });
        }

        const destination = new Destination({
            name,
            location,
            description,
            image,
            touristPlaces: touristPlaces || []
        });

        const savedDestination = await destination.save();

        res.status(201).json({
            message: "Destination added successfully",
            destination: savedDestination
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error adding destination",
            error: error.message
        });
    }
});

// UPDATE DESTINATION
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid destination ID"
            });
        }

        const updatedDestination = await Destination.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedDestination) {
            return res.status(404).json({
                message: "Destination not found"
            });
        }

        res.status(200).json({
            message: "Destination updated successfully",
            destination: updatedDestination
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error updating destination",
            error: error.message
        });
    }
});

// DELETE DESTINATION
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid destination ID"
            });
        }

        const deletedDestination = await Destination.findByIdAndDelete(id);

        if (!deletedDestination) {
            return res.status(404).json({
                message: "Destination not found"
            });
        }

        res.status(200).json({
            message: "Destination deleted successfully",
            destination: deletedDestination
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error deleting destination"
        });
    }
});

module.exports = router;