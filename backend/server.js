const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/db');
connectDB();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Import Error Handlers
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Global middlewares
app.use(cors({
  origin: '*', // Allow development origins
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'FoodieXpress Backend API',
    tagline: 'Delicious Food Delivered to Your Door',
    timestamp: new Date()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[FoodieXpress Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
