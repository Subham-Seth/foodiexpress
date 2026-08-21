import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [flatDiscount, setFlatDiscount] = useState(0);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('foodiexpress_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart items', e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('foodiexpress_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (foodItem, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item._id === foodItem._id);
      const effectivePrice = foodItem.discountedPrice > 0 ? foodItem.discountedPrice : foodItem.price;

      if (existing) {
        showToast(`Updated quantity for ${foodItem.name}`, 'info');
        return prevItems.map((item) =>
          item._id === foodItem._id
            ? { ...item, qty: item.qty + quantity }
            : item
        );
      } else {
        showToast(`Added ${foodItem.name} to cart!`, 'success');
        return [
          ...prevItems,
          {
            _id: foodItem._id,
            name: foodItem.name,
            price: effectivePrice,
            originalPrice: foodItem.price,
            image: foodItem.image,
            isVeg: foodItem.isVeg,
            prepTimeMinutes: foodItem.prepTimeMinutes,
            qty: quantity
          }
        ];
      }
    });
  };

  const removeFromCart = (foodItemId) => {
    const itemToRemove = cartItems.find((i) => i._id === foodItemId);
    setCartItems((prev) => prev.filter((item) => item._id !== foodItemId));
    if (itemToRemove) {
      showToast(`Removed ${itemToRemove.name} from cart`, 'info');
    }
  };

  const updateQuantity = (foodItemId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item._id === foodItemId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
    setDiscountPercent(0);
    setFlatDiscount(0);
    localStorage.removeItem('foodiexpress_cart');
  };

  const applyCoupon = (code) => {
    const cleaned = code.trim().toUpperCase();
    if (cleaned === 'FOODIE10') {
      setCouponCode(cleaned);
      setDiscountPercent(10);
      setFlatDiscount(0);
      showToast('Promo code FOODIE10 applied! (10% OFF)', 'success');
      return true;
    } else if (cleaned === 'WELCOME50') {
      setCouponCode(cleaned);
      setFlatDiscount(50);
      setDiscountPercent(0);
      showToast('Promo code WELCOME50 applied! (₹50 OFF)', 'success');
      return true;
    } else {
      showToast('Invalid or expired coupon code. Try FOODIE10 or WELCOME50', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
    setFlatDiscount(0);
    showToast('Promo code removed', 'info');
  };

  // Calculations
  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  // Free delivery above ₹499
  const deliveryFee = itemsPrice > 499 || itemsPrice === 0 ? 0 : 40;
  
  // 5% Restaurant GST
  const taxPrice = Math.round(itemsPrice * 0.05 * 100) / 100;

  // Calculate discount
  let discountAmount = 0;
  if (discountPercent > 0) {
    discountAmount = Math.round(((itemsPrice * discountPercent) / 100) * 100) / 100;
  } else if (flatDiscount > 0) {
    discountAmount = Math.min(flatDiscount, itemsPrice);
  }

  const totalPrice = Math.max(0, Math.round((itemsPrice + deliveryFee + taxPrice - discountAmount) * 100) / 100);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemsCount,
        itemsPrice,
        deliveryFee,
        taxPrice,
        discountAmount,
        totalPrice,
        couponCode,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
