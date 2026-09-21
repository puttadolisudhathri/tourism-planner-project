const express = require("express");
const Review = require("../models/Review");

const router = express.Router();

// ==========================================
// 1. ADD REVIEW
// POST /api/reviews
// ==========================================

router.post("/", async (req, res) => {
  try {
    const {
      destinationId,
      destination,
      userName,
      userEmail,
      rating,
      comment,
      feedback
    } = req.body;

    // Validate required fields
    if (
      !destinationId ||
      !destination ||
      !userName ||
      rating === undefined ||
      !comment ||
      !comment.trim()
    ) {
      return res.status(400).json({
        message: "All review fields are required"
      });
    }

    // Validate rating
    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    // Create review
    const review = new Review({
      destinationId,
      destination,
      userName,
      userEmail: userEmail || "",
      rating: Number(rating),
      comment: comment.trim(),
      feedback: feedback || ""
    });

    // Save review in MongoDB
    const savedReview = await review.save();

    res.status(201).json({
      message: "Review added successfully",
      review: savedReview
    });
  } catch (error) {
    console.error("Add review error:", error);

    res.status(500).json({
      message: "Error adding review",
      error: error.message
    });
  }
});

// ==========================================
// 2. GET ALL REVIEWS
// GET /api/reviews
// ==========================================

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);

    res.status(500).json({
      message: "Error fetching reviews",
      error: error.message
    });
  }
});

// ==========================================
// 3. GET REVIEWS BY DESTINATION
// GET /api/reviews/destination/:destinationId
// ==========================================

router.get("/destination/:destinationId", async (req, res) => {
  try {
    const reviews = await Review.find({
      destinationId: req.params.destinationId
    }).sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Get destination reviews error:", error);

    res.status(500).json({
      message: "Error fetching destination reviews",
      error: error.message
    });
  }
});

// ==========================================
// 4. GET ONE REVIEW
// GET /api/reviews/:id
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
    console.error("Get one review error:", error);

    res.status(500).json({
      message: "Error fetching review",
      error: error.message
    });
  }
});

// ==========================================
// 5. UPDATE REVIEW
// PUT /api/reviews/:id
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
    console.error("Update review error:", error);

    res.status(500).json({
      message: "Error updating review",
      error: error.message
    });
  }
});

// ==========================================
// 6. DELETE REVIEW
// DELETE /api/reviews/:id
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
    console.error("Delete review error:", error);

    res.status(500).json({
      message: "Error deleting review",
      error: error.message
    });
  }
});

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;