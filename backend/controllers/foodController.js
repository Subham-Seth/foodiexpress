const FoodItem = require('../models/FoodItem');
const Category = require('../models/Category');
const Review = require('../models/Review');

// @desc    Fetch all food items with rich filtering, search & pagination
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res) => {
  try {
    const {
      search,
      category,
      isVeg,
      isSpicy,
      isFeatured,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      limit = 12
    } = req.query;

    const query = { isAvailable: true };

    // Search query filter (name or description)
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { ingredients: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Category filter (support category ObjectId or slug/name)
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({
          $or: [{ slug: category.toLowerCase() }, { name: new RegExp('^' + category + '$', 'i') }]
        });
        if (cat) {
          query.category = cat._id;
        }
      }
    }

    // Veg / Non-Veg filter
    if (isVeg !== undefined && isVeg !== '') {
      query.isVeg = isVeg === 'true';
    }

    // Spicy filter
    if (isSpicy !== undefined && isSpicy !== '') {
      query.isSpicy = isSpicy === 'true';
    }

    // Featured filter
    if (isFeatured !== undefined && isFeatured !== '') {
      query.isFeatured = isFeatured === 'true';
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting strategy
    let sortOptions = { createdAt: -1 }; // default newest
    if (sortBy === 'price-low') {
      sortOptions = { price: 1 };
    } else if (sortBy === 'price-high') {
      sortOptions = { price: -1 };
    } else if (sortBy === 'rating') {
      sortOptions = { rating: -1, numReviews: -1 };
    } else if (sortBy === 'popular') {
      sortOptions = { numReviews: -1, rating: -1 };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalFoods = await FoodItem.countDocuments(query);
    const foods = await FoodItem.find(query)
      .populate('category', 'name slug image')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: foods,
      page: pageNum,
      pages: Math.ceil(totalFoods / limitNum) || 1,
      total: totalFoods
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch featured / top-rated foods for homepage
// @route   GET /api/foods/featured
// @access  Public
const getFeaturedFoods = async (req, res) => {
  try {
    const featured = await FoodItem.find({ isAvailable: true, isFeatured: true })
      .populate('category', 'name slug')
      .limit(8);

    const topRated = await FoodItem.find({ isAvailable: true })
      .populate('category', 'name slug')
      .sort({ rating: -1, numReviews: -1 })
      .limit(8);

    res.json({
      success: true,
      data: {
        featured,
        topRated
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch single food item with reviews
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id).populate('category', 'name slug image');
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    const reviews = await Review.find({ foodItem: food._id }).sort({ createdAt: -1 });

    // Fetch related dishes from same category
    const relatedFoods = await FoodItem.find({
      category: food.category._id || food.category,
      _id: { $ne: food._id },
      isAvailable: true
    }).limit(4);

    res.json({
      success: true,
      data: {
        ...food.toObject(),
        reviews,
        relatedFoods
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new food item
// @route   POST /api/foods
// @access  Private/Admin
const createFood = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountedPrice,
      category,
      image,
      ingredients,
      prepTimeMinutes,
      calories,
      isVeg,
      isSpicy,
      isFeatured,
      isAvailable
    } = req.body;

    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, category, image'
      });
    }

    const catDoc = await Category.findById(category);
    if (!catDoc) {
      return res.status(400).json({ success: false, message: 'Invalid category selected' });
    }

    const food = await FoodItem.create({
      name,
      description,
      price: Number(price),
      discountedPrice: discountedPrice ? Number(discountedPrice) : 0,
      category: catDoc._id,
      categoryName: catDoc.name,
      image,
      ingredients: Array.isArray(ingredients) ? ingredients : (ingredients ? ingredients.split(',').map(s => s.trim()) : []),
      prepTimeMinutes: prepTimeMinutes ? Number(prepTimeMinutes) : 20,
      calories: calories ? Number(calories) : 250,
      isVeg: Boolean(isVeg),
      isSpicy: Boolean(isSpicy),
      isFeatured: Boolean(isFeatured),
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true
    });

    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      data: food
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
const updateFood = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    if (req.body.category && req.body.category !== food.category.toString()) {
      const catDoc = await Category.findById(req.body.category);
      if (catDoc) {
        food.category = catDoc._id;
        food.categoryName = catDoc.name;
      }
    }

    food.name = req.body.name || food.name;
    food.description = req.body.description || food.description;
    food.price = req.body.price !== undefined ? Number(req.body.price) : food.price;
    food.discountedPrice = req.body.discountedPrice !== undefined ? Number(req.body.discountedPrice) : food.discountedPrice;
    food.image = req.body.image || food.image;
    
    if (req.body.ingredients !== undefined) {
      food.ingredients = Array.isArray(req.body.ingredients)
        ? req.body.ingredients
        : req.body.ingredients.split(',').map(s => s.trim());
    }

    food.prepTimeMinutes = req.body.prepTimeMinutes !== undefined ? Number(req.body.prepTimeMinutes) : food.prepTimeMinutes;
    food.calories = req.body.calories !== undefined ? Number(req.body.calories) : food.calories;
    food.isVeg = req.body.isVeg !== undefined ? Boolean(req.body.isVeg) : food.isVeg;
    food.isSpicy = req.body.isSpicy !== undefined ? Boolean(req.body.isSpicy) : food.isSpicy;
    food.isFeatured = req.body.isFeatured !== undefined ? Boolean(req.body.isFeatured) : food.isFeatured;
    food.isAvailable = req.body.isAvailable !== undefined ? Boolean(req.body.isAvailable) : food.isAvailable;

    const updated = await food.save();
    res.json({ success: true, message: 'Food item updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
const deleteFood = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    await FoodItem.findByIdAndDelete(req.params.id);
    await Review.deleteMany({ foodItem: req.params.id });

    res.json({ success: true, message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new review & rating for food item
// @route   POST /api/foods/:id/reviews
// @access  Private
const createFoodReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const food = await FoodItem.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      foodItem: food._id
    });

    if (alreadyReviewed) {
      // Update existing review
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
      await alreadyReviewed.save();
    } else {
      // Create new review
      await Review.create({
        user: req.user._id,
        userName: req.user.name,
        userAvatar: req.user.avatar || '',
        foodItem: food._id,
        rating: Number(rating),
        comment
      });
    }

    // Recalculate average rating for this food item
    const allReviews = await Review.find({ foodItem: food._id });
    food.numReviews = allReviews.length;
    food.rating = (
      allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length
    ).toFixed(1);

    await food.save();

    res.status(201).json({
      success: true,
      message: alreadyReviewed ? 'Review updated successfully' : 'Review submitted successfully',
      data: {
        rating: food.rating,
        numReviews: food.numReviews
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFoods,
  getFeaturedFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  createFoodReview
};
