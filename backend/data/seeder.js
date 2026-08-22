const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Contact = require('../models/Contact');
const connectDB = require('../config/db');
const { categories, sampleFoods } = require('./sampleData');

const importData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Purging old records...');
    await User.deleteMany();
    await Category.deleteMany();
    await FoodItem.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Contact.deleteMany();

    console.log('[Seeder] Creating system users...');
    // Create Admin User
    const adminUser = await User.create({
      name: 'FoodieXpress Admin',
      email: 'admin@foodiexpress.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 98765 43210',
      address: {
        street: '101 Executive Square, Tech Park',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India'
      },
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });

    // Create Customer 1
    const customerUser = await User.create({
      name: 'Alex Johnson',
      email: 'customer@gmail.com',
      password: 'user123',
      role: 'user',
      phone: '+91 91234 56789',
      address: {
        street: 'Flat 402, Green Glen Heights, Outer Ring Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560103',
        country: 'India'
      },
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    });

    // Create Student Demo User
    const studentUser = await User.create({
      name: 'Rohan Sharma (CSE Student)',
      email: 'student@cse.edu',
      password: 'user123',
      role: 'user',
      phone: '+91 98888 12345',
      address: {
        street: 'Room 214, Block B, University Campus Hostel',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560064',
        country: 'India'
      },
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
    });

    console.log('[Seeder] Inserting categories...');
    const insertedCategories = await Category.insertMany(categories);
    const categoryMap = {};
    insertedCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat;
    });

    console.log('[Seeder] Inserting food items...');
    const foodsToInsert = sampleFoods.map((food) => {
      const categoryDoc = categoryMap[food.categorySlug];
      const { categorySlug, ...rest } = food;
      return {
        ...rest,
        category: categoryDoc._id,
        categoryName: categoryDoc.name
      };
    });

    const insertedFoods = await FoodItem.insertMany(foodsToInsert);

    console.log('[Seeder] Adding sample customer reviews...');
    const sampleReviews = [
      {
        user: customerUser._id,
        userName: customerUser.name,
        userAvatar: customerUser.avatar,
        foodItem: insertedFoods[0]._id, // Margherita
        rating: 5,
        comment: 'Absolutely heavenly crust! The mozzarella was super fresh and melted to perfection.'
      },
      {
        user: studentUser._id,
        userName: studentUser.name,
        userAvatar: studentUser.avatar,
        foodItem: insertedFoods[0]._id, // Margherita
        rating: 5,
        comment: 'Great portion size and delivered scorching hot. Highly recommend!'
      },
      {
        user: customerUser._id,
        userName: customerUser.name,
        userAvatar: customerUser.avatar,
        foodItem: insertedFoods[4]._id, // Double Smash Burger
        rating: 5,
        comment: 'The smash sauce and double cheese took this burger to another level!'
      },
      {
        user: studentUser._id,
        userName: studentUser.name,
        userAvatar: studentUser.avatar,
        foodItem: insertedFoods[7]._id, // Chicken Dum Biryani
        rating: 5,
        comment: 'Pure royal taste! The basmati aroma and tender chicken were unbelievable.'
      }
    ];
    await Review.insertMany(sampleReviews);

    console.log('[Seeder] Creating sample orders with tracking status...');
    const sampleOrder1 = await Order.create({
      user: customerUser._id,
      orderItems: [
        {
          foodItem: insertedFoods[0]._id,
          name: insertedFoods[0].name,
          qty: 1,
          price: insertedFoods[0].discountedPrice || insertedFoods[0].price,
          image: insertedFoods[0].image,
          isVeg: insertedFoods[0].isVeg
        },
        {
          foodItem: insertedFoods[4]._id,
          name: insertedFoods[4].name,
          qty: 2,
          price: insertedFoods[4].discountedPrice || insertedFoods[4].price,
          image: insertedFoods[4].image,
          isVeg: insertedFoods[4].isVeg
        }
      ],
      deliveryAddress: {
        fullName: customerUser.name,
        phone: customerUser.phone,
        street: customerUser.address.street,
        city: customerUser.address.city,
        state: customerUser.address.state,
        postalCode: customerUser.address.postalCode,
        instructions: 'Please ring the doorbell and leave at doorstep.'
      },
      paymentMethod: 'Online',
      paymentResult: {
        id: 'PAY_FX_9823412',
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: customerUser.email
      },
      itemsPrice: 957,
      taxPrice: 47.85,
      deliveryFee: 0,
      discountAmount: 50,
      totalPrice: 954.85,
      orderStatus: 'Out for Delivery',
      statusTimeline: [
        {
          status: 'Order Placed',
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          note: 'Your order was received and verified.'
        },
        {
          status: 'Confirmed',
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
          note: 'Kitchen confirmed the order items.'
        },
        {
          status: 'Preparing',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          note: 'Chef prepared freshly baked pizza and burgers.'
        },
        {
          status: 'Out for Delivery',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          note: 'Delivery hero Amit Kumar is on his way with your order.'
        }
      ],
      isPaid: true,
      paidAt: new Date(Date.now() - 25 * 60 * 1000),
      isDelivered: false,
      estimatedDeliveryTime: new Date(Date.now() + 10 * 60 * 1000)
    });

    const sampleOrder2 = await Order.create({
      user: studentUser._id,
      orderItems: [
        {
          foodItem: insertedFoods[7]._id, // Biryani
          name: insertedFoods[7].name,
          qty: 1,
          price: insertedFoods[7].discountedPrice || insertedFoods[7].price,
          image: insertedFoods[7].image,
          isVeg: insertedFoods[7].isVeg
        },
        {
          foodItem: insertedFoods[13]._id, // Lava cake
          name: insertedFoods[13].name,
          qty: 1,
          price: insertedFoods[13].discountedPrice || insertedFoods[13].price,
          image: insertedFoods[13].image,
          isVeg: insertedFoods[13].isVeg
        }
      ],
      deliveryAddress: {
        fullName: studentUser.name,
        phone: studentUser.phone,
        street: studentUser.address.street,
        city: studentUser.address.city,
        state: studentUser.address.state,
        postalCode: studentUser.address.postalCode,
        instructions: 'Call upon arrival at main gate.'
      },
      paymentMethod: 'COD',
      itemsPrice: 578,
      taxPrice: 28.9,
      deliveryFee: 40,
      discountAmount: 0,
      totalPrice: 646.9,
      orderStatus: 'Delivered',
      statusTimeline: [
        {
          status: 'Order Placed',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          note: 'Order placed by student customer.'
        },
        {
          status: 'Confirmed',
          timestamp: new Date(Date.now() - 110 * 60 * 1000),
          note: 'Confirmed by kitchen.'
        },
        {
          status: 'Preparing',
          timestamp: new Date(Date.now() - 95 * 60 * 1000),
          note: 'Fresh dum biryani and lava cake prepared.'
        },
        {
          status: 'Out for Delivery',
          timestamp: new Date(Date.now() - 70 * 60 * 1000),
          note: 'Out for delivery.'
        },
        {
          status: 'Delivered',
          timestamp: new Date(Date.now() - 40 * 60 * 1000),
          note: 'Successfully handed over to customer.'
        }
      ],
      isPaid: true,
      paidAt: new Date(Date.now() - 40 * 60 * 1000),
      isDelivered: true,
      deliveredAt: new Date(Date.now() - 40 * 60 * 1000)
    });

    console.log('[Seeder] Creating sample contact inquiries...');
    await Contact.create({
      name: 'Priya Mehta',
      email: 'priya@techcorp.io',
      subject: 'Bulk Corporate Catering Inquiry',
      message: 'Hello FoodieXpress team! We would like to order lunch for our team of 60 members this Friday. Do you provide corporate discount packages?'
    });

    console.log('========================================================');
    console.log(' SUCCESS: FoodieXpress Database Seeded Successfully!');
    console.log('--------------------------------------------------------');
    console.log(' Admin Account:    admin@foodiexpress.com  / admin123');
    console.log(' Customer Account: customer@gmail.com      / user123');
    console.log(' Student Account:  student@cse.edu         / user123');
    console.log(` Inserted Categories: ${insertedCategories.length}`);
    console.log(` Inserted Foods:      ${insertedFoods.length}`);
    console.log('========================================================');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Category.deleteMany();
    await FoodItem.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Contact.deleteMany();
    console.log('[Seeder] All database records destroyed.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Destroy Error]: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
