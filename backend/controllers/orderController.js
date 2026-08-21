const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      deliveryAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      deliveryFee,
      discountAmount,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items specified' });
    }

    if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.street) {
      return res.status(400).json({ success: false, message: 'Please provide full delivery address details' });
    }

    const estimatedDelivery = new Date(Date.now() + 35 * 60 * 1000); // 35 minutes from now

    const order = new Order({
      user: req.user._id,
      orderItems,
      deliveryAddress,
      paymentMethod: paymentMethod || 'COD',
      itemsPrice: Number(itemsPrice),
      taxPrice: Number(taxPrice) || 0,
      deliveryFee: Number(deliveryFee) || 0,
      discountAmount: Number(discountAmount) || 0,
      totalPrice: Number(totalPrice),
      orderStatus: 'Order Placed',
      statusTimeline: [
        {
          status: 'Order Placed',
          timestamp: new Date(),
          note: 'Your order has been received by FoodieXpress restaurant.'
        }
      ],
      isPaid: paymentMethod === 'Online' || paymentMethod === 'Card',
      paidAt: paymentMethod === 'Online' || paymentMethod === 'Card' ? new Date() : null,
      estimatedDeliveryTime: estimatedDelivery
    });

    const createdOrder = await order.save();
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: createdOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's order history
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone avatar')
      .populate('orderItems.foodItem', 'name price image isVeg prepTimeMinutes');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify user owns order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order payment status to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id || `PAY-${Date.now()}`,
      status: req.body.status || 'COMPLETED',
      update_time: req.body.update_time || new Date().toISOString(),
      email_address: req.body.email_address || req.user.email
    };

    const updatedOrder = await order.save();
    res.json({ success: true, message: 'Payment recorded successfully', data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      data: orders,
      page: pageNum,
      pages: Math.ceil(totalOrders / limitNum) || 1,
      total: totalOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order lifecycle status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;

    // Set completion flag if delivered
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      if (order.paymentMethod === 'COD') {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
    }

    const defaultNotes = {
      'Confirmed': 'Your order has been confirmed by the kitchen.',
      'Preparing': 'Chef is preparing your delicious meal with fresh ingredients.',
      'Out for Delivery': 'Delivery partner has picked up your order and is on the way.',
      'Delivered': 'Order has been successfully delivered. Enjoy your meal!',
      'Cancelled': 'Order was cancelled.'
    };

    order.statusTimeline.push({
      status,
      timestamp: new Date(),
      note: note || defaultNotes[status] || `Order status updated to ${status}`
    });

    const updatedOrder = await order.save();
    res.json({ success: true, message: `Order status updated to ${status}`, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getOrders,
  updateOrderStatus
};
