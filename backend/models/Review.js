const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    userAvatar: {
      type: String,
      default: ''
    },
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Please write a review comment'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent a user from submitting multiple reviews for the exact same food item
reviewSchema.index({ user: 1, foodItem: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
