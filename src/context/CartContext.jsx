import React, { createContext, useState, useEffect, useContext } from 'react';
import bookingApi from '../api/bookingApi';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Load cart from backend when user is available
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await bookingApi.getCart();
      // Assuming response structure matches our frontend cart format
      setCart(response.bookingRooms || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart using backend API
  const addToCart = async (bookingData) => {
    if (!user) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return null;
    }

    try {
      setLoading(true);
      
      // Transform frontend data to backend format
      const bookingRoomRequest = {
        roomClassId: bookingData.room.id,
        quantity: bookingData.quantity,
        checkinDate: `${bookingData.checkInDate}T${bookingData.checkInTime}:00`,
        checkoutDate: `${bookingData.checkOutDate}T${bookingData.checkOutTime}:00`,
        numAdults: bookingData.adults,
        numChildren: bookingData.children,
        addons: bookingData.selectedAddons.map(addon => ({
          addonId: addon.id,
          quantity: addon.quantity
        }))
      };

      const response = await bookingApi.addToCart(bookingRoomRequest);
      
      // Update local cart state
      setCart(response.bookingRooms || []);
      
      return response;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart using backend API
  const removeFromCart = async (bookingRoomId) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await bookingApi.removeFromCart(bookingRoomId);
      setCart(response.bookingRooms || []);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item addons
  const updateCartItemAddons = async (bookingRoomId, addons) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await bookingApi.updateCartItemAddons(bookingRoomId, addons);
      setCart(response.bookingRooms || []);
    } catch (error) {
      console.error('Error updating cart addons:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart using backend API
  const clearCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await bookingApi.clearCart();
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get total items count
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // Get total price (assuming backend provides calculated total)
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.totalPrice || 0), 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateCartItemAddons,
    clearCart,
    getTotalItems,
    getTotalPrice,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;