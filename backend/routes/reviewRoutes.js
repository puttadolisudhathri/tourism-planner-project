
const express = require("express");
const Review = require("../models/Review");

const router = express.Router();

// ==========================================
// 1. ADD REVIEW
// ==========================================

router.post("/", async (req, res) => {
    try {
        const {
            destinationId,
            userName,
            rating,
            comment
        } = req.body;

        if (
            !destinationId ||
            !userName ||
            rating === undefined ||
            !comment
        ) {
            return res.status(400).json({
                message: "All review fields are required"
            });
        }

        if (Number(rating) < 1 || Number(rating) > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        const review = new Review({
            destinationId,
            userName,
            rating: Number(rating),
            comment
        });

        const savedReview = await review.save();

        res.status(201).json({
            message: "Review added successfully",
            review: savedReview
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error adding review",
            error: error.message
        });
    }
});

// ==========================================
// 2. GET ALL REVIEWS
// ==========================================

router.get("/", async (req, res) => {
    try {
        const reviews = await Review.find()
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error fetching reviews"
        });
    }
});

// ==========================================
// 3. GET REVIEWS BY DESTINATION
// ==========================================

router.get("/destination/:destinationId", async (req, res) => {
    try {
        const reviews = await Review.find({
            destinationId: req.params.destinationId
        }).sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error fetching destination reviews"
        });
    }
});

// ==========================================
// 4. GET ONE REVIEW
// ==========================================

router.get("/:id", async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        res.status(200).json(review);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error fetching review"
        });
    }
});

// ==========================================
// 5. UPDATE REVIEW
// ==========================================

router.put("/:id", async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedReview) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        res.status(200).json({
            message: "Review updated successfully",
            review: updatedReview
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error updating review",
            error: error.message
        });
    }
});

// ==========================================
// 6. DELETE REVIEW
// ==========================================

router.delete("/:id", async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(
            req.params.id
        );

        if (!deletedReview) {
            return res.status(404).json({
                message: "Review not found"
            });
        }

        res.status(200).json({
            message: "Review deleted successfully",
            review: deletedReview
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error deleting review"
        });
    }
});

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;