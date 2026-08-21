const categories = [
  {
    name: 'Artisan Pizzas',
    slug: 'artisan-pizzas',
    description: 'Stone-baked crispy crusts loaded with fresh mozzarella and premium toppings.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Gourmet Burgers',
    slug: 'gourmet-burgers',
    description: 'Juicy, seasoned patties nestled in toasted brioche buns with signature sauces.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Biryani & Kebabs',
    slug: 'biryani-kebabs',
    description: 'Fragrant basmati rice slow-cooked with royal spices and succulent meats or paneer.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Pan-Asian & Noodles',
    slug: 'pan-asian-noodles',
    description: 'Wok-tossed noodles, dim sums, and spicy schezwan gravies bursting with umami.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Desserts & Shakes',
    slug: 'desserts-shakes',
    description: 'Decadent lava cakes, creamy thickshakes, and delightful sweet treats.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Healthy Bowls & Salads',
    slug: 'healthy-bowls-salads',
    description: 'Nutrient-rich power bowls, farm-fresh greens, and guilt-free delicacies.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Beverages & Mocktails',
    slug: 'beverages-mocktails',
    description: 'Refreshing fruit coolers, iced teas, and craft cold brews to quench your thirst.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80'
  }
];

const sampleFoods = [
  // Pizzas
  {
    name: 'Classic Margherita Supreme',
    categorySlug: 'artisan-pizzas',
    description: 'San Marzano tomato base, fresh buffalo mozzarella, fragrant sweet basil, and extra virgin olive oil drizzle.',
    price: 349,
    discountedPrice: 299,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    ingredients: ['San Marzano Tomatoes', 'Buffalo Mozzarella', 'Fresh Basil', 'Olive Oil', 'Sourdough Crust'],
    prepTimeMinutes: 18,
    calories: 680,
    isVeg: true,
    isSpicy: false,
    isFeatured: true,
    rating: 4.8,
    numReviews: 34
  },
  {
    name: 'Smoky BBQ Chicken Feast Pizza',
    categorySlug: 'artisan-pizzas',
    description: 'Tender grilled chicken chunks smothered in smoky barbecue glaze with red onions, bell peppers, and mozzarella.',
    price: 499,
    discountedPrice: 429,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Grilled BBQ Chicken', 'Caramelized Onion', 'Bell Peppers', 'Mozzarella', 'Cheddar', 'BBQ Swirl'],
    prepTimeMinutes: 22,
    calories: 890,
    isVeg: false,
    isSpicy: true,
    isFeatured: true,
    rating: 4.9,
    numReviews: 48
  },
  {
    name: 'Truffle & Wild Mushroom Pizza',
    categorySlug: 'artisan-pizzas',
    description: 'Creamy garlic sauce, sautéed portobello and button mushrooms, fontina cheese, and black truffle oil.',
    price: 529,
    discountedPrice: 469,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Wild Portobello Mushrooms', 'Black Truffle Oil', 'Fontina Cheese', 'Garlic Bechamel', 'Thyme'],
    prepTimeMinutes: 20,
    calories: 740,
    isVeg: true,
    isSpicy: false,
    isFeatured: false,
    rating: 4.7,
    numReviews: 19
  },
  {
    name: 'Fiery Peri-Peri Paneer Pizza',
    categorySlug: 'artisan-pizzas',
    description: 'Char-grilled cottage cheese cubes tossed in piquant peri-peri spice blend with jalapenos and red paprika.',
    price: 419,
    discountedPrice: 359,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Peri-Peri Paneer', 'Jalapenos', 'Red Paprika', 'Mozzarella', 'Spicy Marinara'],
    prepTimeMinutes: 18,
    calories: 780,
    isVeg: true,
    isSpicy: true,
    isFeatured: true,
    rating: 4.6,
    numReviews: 29
  },

  // Burgers
  {
    name: 'The Ultimate Double Smash Burger',
    categorySlug: 'gourmet-burgers',
    description: 'Two crispy-edged prime beef/chicken patties, double melted American cheese, secret smash sauce, and pickles on brioche.',
    price: 389,
    discountedPrice: 329,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Double Patty', 'Aged Cheddar', 'Smash Sauce', 'Dill Pickles', 'Brioche Bun'],
    prepTimeMinutes: 15,
    calories: 820,
    isVeg: false,
    isSpicy: false,
    isFeatured: true,
    rating: 4.9,
    numReviews: 52
  },
  {
    name: 'Crispy Korean Fried Chicken Burger',
    categorySlug: 'gourmet-burgers',
    description: 'Extra crunchy fried chicken thigh drenched in sweet & spicy Gochujang glaze with pickled radish and kimchi slaw.',
    price: 369,
    discountedPrice: 319,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Crispy Chicken Thigh', 'Gochujang Glaze', 'Kimchi Slaw', 'Toasted Sesame', 'Brioche Bun'],
    prepTimeMinutes: 16,
    calories: 790,
    isVeg: false,
    isSpicy: true,
    isFeatured: true,
    rating: 4.8,
    numReviews: 41
  },
  {
    name: 'Cheesy Truffle Mushroom Veg Burger',
    categorySlug: 'gourmet-burgers',
    description: 'Crispy crumbed portobello patty oozing with molten gouda cheese, truffle aioli, and baby arugula.',
    price: 329,
    discountedPrice: 289,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Crumbed Mushroom Patty', 'Molten Gouda', 'Truffle Mayo', 'Rocket Greens', 'Potato Bun'],
    prepTimeMinutes: 15,
    calories: 640,
    isVeg: true,
    isSpicy: false,
    isFeatured: false,
    rating: 4.7,
    numReviews: 23
  },

  // Biryani & Kebabs
  {
    name: 'Hyderabadi Shahi Dum Biryani (Chicken)',
    categorySlug: 'biryani-kebabs',
    description: 'Authentic royal recipe with tender marinated chicken layered with saffron-scented basmati rice, served with mirchi ka salan and raita.',
    price: 449,
    discountedPrice: 389,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Basmati Rice', 'Farm Fresh Chicken', 'Kewra & Rose Water', 'Browned Onions (Birista)', 'Mint & Coriander', 'Saffron'],
    prepTimeMinutes: 25,
    calories: 720,
    isVeg: false,
    isSpicy: true,
    isFeatured: true,
    rating: 4.9,
    numReviews: 67
  },
  {
    name: 'Royal Paneer Tikka Dum Biryani',
    categorySlug: 'biryani-kebabs',
    description: 'Char-grilled malai paneer tikka slow-cooked with whole spices, layered basmati rice, caramelized onions, and saffron essence.',
    price: 379,
    discountedPrice: 329,
    image: 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Malai Paneer', 'Long Grain Basmati', 'Shahi Masala', 'Ghee', 'Cashew Nuts', 'Saffron'],
    prepTimeMinutes: 22,
    calories: 650,
    isVeg: true,
    isSpicy: true,
    isFeatured: true,
    rating: 4.8,
    numReviews: 38
  },
  {
    name: 'Melt-in-Mouth Galouti Kebabs (6 Pcs)',
    categorySlug: 'biryani-kebabs',
    description: 'Finely minced spiced meat patties infused with 24 secret Awadhi spices, pan-seared to golden tenderness. Served with mint chutney and ulte tawa ka paratha.',
    price: 399,
    discountedPrice: 349,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Minced Meat/Lentils', 'Awadhi Potli Masala', 'Desi Ghee', 'Rose Petals', 'Mint Chutney'],
    prepTimeMinutes: 20,
    calories: 520,
    isVeg: false,
    isSpicy: true,
    isFeatured: false,
    rating: 4.9,
    numReviews: 31
  },

  // Pan-Asian & Noodles
  {
    name: 'Signature Hakka Noodles with Crispy Veg',
    categorySlug: 'pan-asian-noodles',
    description: 'Wok-tossed noodles with crunchy bell peppers, cabbage, scallions, and light soya garlic reduction.',
    price: 249,
    discountedPrice: 209,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Eggless Wheat Noodles', 'Bok Choy', 'Bell Peppers', 'Dark Soy Sauce', 'Toasted Sesame Oil'],
    prepTimeMinutes: 12,
    calories: 460,
    isVeg: true,
    isSpicy: false,
    isFeatured: false,
    rating: 4.6,
    numReviews: 22
  },
  {
    name: 'Spicy Schezwan Chicken Gravy & Rice Bowl',
    categorySlug: 'pan-asian-noodles',
    description: 'Diced chicken tossed in fiery homemade Sichuan pepper gravy served alongside steaming Jasmine fragrant rice.',
    price: 339,
    discountedPrice: 289,
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Chicken Breast', 'Sichuan Peppercorns', 'Red Chillies', 'Jasmine Rice', 'Scallions'],
    prepTimeMinutes: 15,
    calories: 610,
    isVeg: false,
    isSpicy: true,
    isFeatured: true,
    rating: 4.8,
    numReviews: 35
  },
  {
    name: 'Steamed Crystal Dim Sums (8 Pcs)',
    categorySlug: 'pan-asian-noodles',
    description: 'Translucent dumplings stuffed with water chestnuts, wild mushrooms, and scallions. Served with chilli oil dip.',
    price: 289,
    discountedPrice: 249,
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Water Chestnuts', 'Shiitake Mushrooms', 'Tapioca Starch', 'Chilli Garlic Oil'],
    prepTimeMinutes: 14,
    calories: 310,
    isVeg: true,
    isSpicy: false,
    isFeatured: false,
    rating: 4.7,
    numReviews: 18
  },

  // Desserts & Shakes
  {
    name: 'Warm Belgian Chocolate Molten Lava Cake',
    categorySlug: 'desserts-shakes',
    description: 'Rich dark chocolate sponge cake with a warm flowing liquid chocolate center, served with a scoop of vanilla bean ice cream.',
    price: 229,
    discountedPrice: 189,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    ingredients: ['70% Belgian Dark Chocolate', 'Butter', 'Madagascar Vanilla', 'Sugar', 'Flour'],
    prepTimeMinutes: 10,
    calories: 490,
    isVeg: true,
    isSpicy: false,
    isFeatured: true,
    rating: 4.9,
    numReviews: 76
  },
  {
    name: 'Nutella Ferrero Thickshake',
    categorySlug: 'desserts-shakes',
    description: 'Creamy gelato blended with generous scoops of authentic Nutella, crushed Ferrero Rocher, topped with whipped cream.',
    price: 249,
    discountedPrice: 219,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Nutella', 'Ferrero Rocher Chocolates', 'Vanilla Gelato', 'Whole Milk', 'Whipped Cream'],
    prepTimeMinutes: 8,
    calories: 580,
    isVeg: true,
    isSpicy: false,
    isFeatured: true,
    rating: 4.9,
    numReviews: 54
  },
  {
    name: 'New York Baked Berry Cheesecake Slice',
    categorySlug: 'desserts-shakes',
    description: 'Velvety cream cheese filling on a buttery graham cracker crust, crowned with sweet wild berry compote.',
    price: 269,
    discountedPrice: 239,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Philadelphia Cream Cheese', 'Graham Crackers', 'Wild Berry Compote', 'Butter'],
    prepTimeMinutes: 5,
    calories: 430,
    isVeg: true,
    isSpicy: false,
    isFeatured: false,
    rating: 4.8,
    numReviews: 27
  },

  // Healthy & Salads
  {
    name: 'Mediterranean Grilled Chicken Greek Salad',
    categorySlug: 'healthy-bowls-salads',
    description: 'Herb-marinated grilled chicken breast, crisp romaine, kalamata olives, cherry tomatoes, cucumbers, and crumbled feta with lemon-oregano vinaigrette.',
    price: 329,
    discountedPrice: 289,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Grilled Chicken Breast', 'Feta Cheese', 'Kalamata Olives', 'Romaine Lettuce', 'Cherry Tomatoes', 'Extra Virgin Olive Oil'],
    prepTimeMinutes: 10,
    calories: 340,
    isVeg: false,
    isSpicy: false,
    isFeatured: false,
    rating: 4.7,
    numReviews: 24
  },
  {
    name: 'Avocado & Quinoa Superfood Power Bowl',
    categorySlug: 'healthy-bowls-salads',
    description: 'Organic tricolor quinoa, sliced Hass avocado, edamame, roasted sweet potatoes, and toasted pumpkin seeds with tahini goddess dressing.',
    price: 349,
    discountedPrice: 309,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Hass Avocado', 'Organic Quinoa', 'Edamame Beans', 'Roasted Sweet Potato', 'Tahini Dressing', 'Pumpkin Seeds'],
    prepTimeMinutes: 12,
    calories: 390,
    isVeg: true,
    isSpicy: false,
    isFeatured: true,
    rating: 4.8,
    numReviews: 32
  },

  // Beverages
  {
    name: 'Fresh Mint Lime Cooler (Mojito Style)',
    categorySlug: 'beverages-mocktails',
    description: 'Muddled fresh garden mint leaves, freshly squeezed Tahitian limes, cane syrup, topped with sparkling club soda.',
    price: 149,
    discountedPrice: 119,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Garden Mint', 'Tahitian Limes', 'Sparkling Soda', 'Cane Sugar', 'Crushed Ice'],
    prepTimeMinutes: 5,
    calories: 90,
    isVeg: true,
    isSpicy: false,
    isFeatured: false,
    rating: 4.7,
    numReviews: 45
  },
  {
    name: 'Cold Brew Vanilla Sweet Cream Coffee',
    categorySlug: 'beverages-mocktails',
    description: '18-hour steep single-origin Arabica cold brew poured over ice, cascading with house-made vanilla sweet cream.',
    price: 199,
    discountedPrice: 169,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Single Origin Arabica Beans', 'Vanilla Cream', 'Filtered Water', 'Ice'],
    prepTimeMinutes: 5,
    calories: 140,
    isVeg: true,
    isSpicy: false,
    isFeatured: true,
    rating: 4.9,
    numReviews: 60
  }
];

module.exports = {
  categories,
  sampleFoods
};
