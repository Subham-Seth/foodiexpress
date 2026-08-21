const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food item name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Food item description is required']
    },
    price: {
      type: Number,
      required: [true, 'Food item price is required'],
      min: [0, 'Price must be a positive number']
    },
    discountedPrice: {
      type: Number,
      default: 0,
      min: [0, 'Discounted price cannot be negative']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required']
    },
    categoryName: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      required: [true, 'Food image URL is required']
    },
    ingredients: [
      {
        type: String,
        trim: true
      }
    ],
    prepTimeMinutes: {
      type: Number,
      default: 20
    },
    calories: {
      type: Number,
      default: 300
    },
    isVeg: {
      type: Boolean,
      default: false
    },
    isSpicy: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Add index for text search on name and description
foodItemSchema.index({ name: 'text', description: 'text' });

const FoodItem = mongoose.model('FoodItem', foodItemSchema);
module.exports = FoodItem;
