const express = require('express');
const router = express.Router();
const {
  getFoods,
  getFeaturedFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  createFoodReview
} = require('../controllers/foodController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getFoods)
  .post(protect, admin, createFood);

router.get('/featured', getFeaturedFoods);

router.route('/:id')
  .get(getFoodById)
  .put(protect, admin, updateFood)
  .delete(protect, admin, deleteFood);

router.route('/:id/reviews')
  .post(protect, createFoodReview);

module.exports = router;
