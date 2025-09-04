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

      // Fallback to localStorage
      try {
        const localCart = JSON.parse(localStorage.getItem('bookingCart') || '[]');
        setCart(localCart);
        console.log('Using localStorage cart as fallback');
      } catch (localError) {
        console.error('Error loading localStorage cart:', localError);
        setCart([]);
      }
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

      // Validate required data
      if (!bookingData.room?.id) {
        throw new Error('Thông tin phòng không hợp lệ');
      }

      if (!bookingData.checkInDate || !bookingData.checkOutDate) {
        throw new Error('Vui lòng chọn ngày check-in và check-out');
      }

      if (new Date(bookingData.checkOutDate) <= new Date(bookingData.checkInDate)) {
        throw new Error('Ngày check-out phải sau ngày check-in');
      }

      // Transform frontend data to backend format
      const bookingRoomRequest = {
        roomClassId: bookingData.room.id,
        quantity: bookingData.quantity || 1,
        checkinDate: `${bookingData.checkInDate}T${bookingData.checkInTime || '14:00'}:00`,
        checkoutDate: `${bookingData.checkOutDate}T${bookingData.checkOutTime || '12:00'}:00`,
        numAdults: bookingData.adults || 1,
        numChildren: bookingData.children || 0,
        addons: (bookingData.selectedAddons || []).map(addon => ({
          addonId: addon.id,
          quantity: addon.quantity || 1
        }))
      };

      console.log('Sending booking request:', bookingRoomRequest);

      const response = await bookingApi.addToCart(bookingRoomRequest);

      console.log('Cart response:', response);

      // Update local cart state
      setCart(response.bookingRooms || []);

      return response;
    } catch (error) {
      console.error('Error adding to cart:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      // Fallback to localStorage if API is not available
      if (error.code === 'NETWORK_ERROR' || error.response?.status >= 500) {
        console.log('API not available, using localStorage fallback');

        try {
          // Create a cart item for localStorage
          const cartItem = {
            id: Date.now(), // Simple ID generation
            room: bookingData.room,
            quantity: bookingData.quantity || 1,
            checkInDate: bookingData.checkInDate,
            checkOutDate: bookingData.checkOutDate,
            checkInTime: bookingData.checkInTime || '14:00',
            checkOutTime: bookingData.checkOutTime || '12:00',
            adults: bookingData.adults || 1,
            children: bookingData.children || 0,
            selectedAddons: bookingData.selectedAddons || [],
            totalPrice: bookingData.totalPrice || 0,
            createdAt: new Date().toISOString()
          };

          // Get existing cart from localStorage
          const existingCart = JSON.parse(localStorage.getItem('bookingCart') || '[]');
          const updatedCart = [...existingCart, cartItem];

          // Save to localStorage
          localStorage.setItem('bookingCart', JSON.stringify(updatedCart));

          // Update local state
          setCart(updatedCart);

          // Return success response
          return { success: true, fallback: true, bookingRooms: updatedCart };

        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          throw error; // Throw original error
        }
      }

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