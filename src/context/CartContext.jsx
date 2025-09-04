import React, { createContext, useState, useEffect, useContext } from 'react';
import bookingApi from '../api/bookingApi';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Load cart from backend when user is available
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // Try to load from localStorage as fallback
      const localCart = localStorage.getItem('tempCart');
      if (localCart) {
        try {
          setCart(JSON.parse(localCart));
        } catch (e) {
          setCart([]);
        }
      } else {
        setCart([]);
      }
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) {
      // Try to load from localStorage
      const localCart = localStorage.getItem('tempCart');
      if (localCart) {
        try {
          setCart(JSON.parse(localCart));
        } catch (e) {
          setCart([]);
        }
      }
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await bookingApi.getCart();
      console.log('Cart fetched:', response);
      
      // Transform backend cart to frontend format
      if (response && response.items) {
        console.log('Cart items from backend:', response.items);
        const transformedCart = response.items.map(item => {
          console.log('Processing cart item:', item);
          return {
            id: item.id,
            room: {
              id: item.roomClassId,
              name: item.roomClassName,
              price: Number(item.roomPrice) || 0,
              image: item.roomImagePaths?.[0] || item.image || null,
              roomImagePaths: item.roomImagePaths,
              capacity: item.capacity,
              hotel: item.hotelName
            },
            quantity: item.quantity,
            checkInDate: item.checkinDate ? new Date(item.checkinDate).toISOString().split('T')[0] : '',
            checkInTime: item.checkinDate ? new Date(item.checkinDate).toTimeString().slice(0, 5) : '14:00',
            checkOutDate: item.checkoutDate ? new Date(item.checkoutDate).toISOString().split('T')[0] : '',
            checkOutTime: item.checkoutDate ? new Date(item.checkoutDate).toTimeString().slice(0, 5) : '11:00',
            adults: item.numAdults || 1,
            children: item.numChildren || 0,
            selectedAddons: item.addons || [],
            nights: Math.ceil((new Date(item.checkoutDate) - new Date(item.checkinDate)) / (1000 * 60 * 60 * 24)),
            roomTotal: item.subtotal,
            totalPrice: item.subtotal,
            // Keep raw data for debugging
            _raw: item
          };
        });
        setCart(transformedCart);
      } else {
        // Fallback to localStorage if backend fails
        const localCart = localStorage.getItem('tempCart');
        if (localCart) {
          try {
            setCart(JSON.parse(localCart));
          } catch (e) {
            setCart([]);
          }
        } else {
          setCart([]);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error.message);
      
      // Fallback to localStorage on error
      const localCart = localStorage.getItem('tempCart');
      if (localCart) {
        try {
          setCart(JSON.parse(localCart));
        } catch (e) {
          setCart([]);
        }
      } else {
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
      setError(null);
      
      // Transform frontend data to backend format
      const bookingRoomRequest = {
        roomClassId: bookingData.room.id,
        quantity: bookingData.quantity || 1,
        checkinDate: `${bookingData.checkInDate}T${bookingData.checkInTime}:00`,
        checkoutDate: `${bookingData.checkOutDate}T${bookingData.checkOutTime}:00`,
        numAdults: bookingData.adults || 1,
        numChildren: bookingData.children || 0,
        addons: bookingData.selectedAddons?.map(addon => ({
          addonId: addon.id,
          quantity: addon.quantity || 1
        })) || []
      };

      console.log('Adding to cart with data:', bookingRoomRequest);

      const response = await bookingApi.addToCart(bookingRoomRequest);
      console.log('Add to cart response:', response);
      
      // If backend doesn't support cart yet, save to localStorage as fallback
      if (!response || response.error) {
        const tempCart = [...cart, {
          id: `temp_${Date.now()}`,
          room: {
            ...bookingData.room,
            price: Number(bookingData.room.price) || 0
          },
          quantity: bookingData.quantity || 1,
          checkInDate: bookingData.checkInDate,
          checkInTime: bookingData.checkInTime,
          checkOutDate: bookingData.checkOutDate,
          checkOutTime: bookingData.checkOutTime,
          adults: bookingData.adults || 1,
          children: bookingData.children || 0,
          selectedAddons: bookingData.selectedAddons || [],
          nights: bookingData.nights || 1,
          roomTotal: Number(bookingData.roomTotal) || 0,
          addonsTotal: Number(bookingData.addonsTotal) || 0,
          totalPrice: Number(bookingData.totalPrice) || 0
        }];
        setCart(tempCart);
        localStorage.setItem('tempCart', JSON.stringify(tempCart));
        return { success: true, fallback: true };
      }
      
      // Refresh cart after adding
      await fetchCart();
      
      return response;
    } catch (error) {
      console.error('Error adding to cart:', error);
      console.error('Error response:', error.response?.data);
      
      // Better error handling
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || 'Dữ liệu không hợp lệ';
        console.error('400 Error details:', error.response.data);
        setError(errorMessage);
        
        // Fallback to localStorage if backend fails
        const tempCart = [...cart, {
          id: `temp_${Date.now()}`,
          ...bookingData,
          nights: Math.ceil((new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24))
        }];
        setCart(tempCart);
        localStorage.setItem('tempCart', JSON.stringify(tempCart));
        
        // Return success with fallback flag
        return { success: true, fallback: true, message: 'Đã lưu vào giỏ hàng tạm thời' };
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        setError('Không thể thêm vào giỏ hàng');
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart using backend API
  const removeFromCart = async (bookingRoomId) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const response = await bookingApi.removeFromCart(bookingRoomId);
      console.log('Remove from cart response:', response);
      
      // Refresh cart after removing
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item (local only for now, can be extended to backend)
  const updateCartItem = (itemId, updates) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  // Update cart item addons using backend API
  const updateCartItemAddons = async (bookingRoomId, addons) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const formattedAddons = addons.map(addon => ({
        addonId: addon.id,
        quantity: addon.quantity || 1
      }));
      
      const response = await bookingApi.updateCartItemAddons(bookingRoomId, formattedAddons);
      console.log('Update addons response:', response);
      
      // Refresh cart after updating
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart addons:', error);
      setError(error.message);
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
      setError(null);
      await bookingApi.clearCart();
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Checkout - convert cart to booking
  const checkout = async () => {
    if (!user) return null;

    try {
      setLoading(true);
      setError(null);
      const response = await bookingApi.checkout();
      console.log('Checkout response:', response);
      
      // Clear cart after successful checkout
      setCart([]);
      
      return response;
    } catch (error) {
      console.error('Error during checkout:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get total items count
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // Get total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.totalPrice || 0), 0);
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateCartItem,
    updateCartItemAddons,
    clearCart,
    checkout,
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