import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import addonApi from '../api/addonApi';

export const useEnhancedBooking = () => {
  const location = useLocation();
  const [room, setRoom] = useState(null);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking state
  const [quantity, setQuantity] = useState(1);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('11:00');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Initialize from navigation state
  useEffect(() => {
    if (location.state?.room) {
      setRoom(location.state.room);
      
      // Set default dates if provided
      if (location.state.checkIn) setCheckInDate(location.state.checkIn);
      if (location.state.checkOut) setCheckOutDate(location.state.checkOut);
      if (location.state.guests) setAdults(location.state.guests);
    }
  }, [location.state]);

  // Fetch all addons from real API
  useEffect(() => {
    const fetchAddons = async () => {
      try {
        setLoading(true);
        const response = await addonApi.getAll();
        // Lọc chỉ các addon active
        const activeAddons = response.filter(addon => addon.active);
        setAddons(activeAddons);
      } catch (error) {
        console.error('Failed to fetch addons:', error);
        setAddons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddons();
  }, []);

  const handleDateTimeChange = (field, value) => {
    switch (field) {
      case 'checkInDate':
        setCheckInDate(value);
        break;
      case 'checkInTime':
        setCheckInTime(value);
        break;
      case 'checkOutDate':
        setCheckOutDate(value);
        break;
      case 'checkOutTime':
        setCheckOutTime(value);
        break;
    }
  };

  const handleGuestChange = (type, value) => {
    if (type === 'adults') {
      setAdults(value);
    } else if (type === 'children') {
      setChildren(value);
    }
  };

  const handleAddonToggle = (addonId) => {
    setSelectedAddons(prev => 
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const getBookingData = () => {
    const nights = checkInDate && checkOutDate 
      ? Math.max(0, Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)))
      : 0;
      
    const roomTotal = nights * quantity * (room?.price || 0);
    const addonsTotal = selectedAddons.reduce((total, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return total + (addon?.price ? Number(addon.price) : 0);
    }, 0);
    
    const subtotal = roomTotal + addonsTotal;
    const tax = subtotal * 0.1;
    const totalPrice = subtotal + tax;

    // Include selected addon details for cart
    const selectedAddonDetails = selectedAddons.map(id => 
      addons.find(a => a.id === id)
    ).filter(Boolean);

    return {
      room,
      quantity,
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
      adults,
      children,
      selectedAddons,
      selectedAddonDetails, // Include full addon details
      nights,
      roomTotal,
      addonsTotal,
      tax,
      totalPrice
    };
  };

  const isBookingValid = () => {
    return (
      room &&
      quantity > 0 &&
      checkInDate &&
      checkOutDate &&
      new Date(checkOutDate) > new Date(checkInDate) &&
      adults > 0 &&
      (adults + children) <= (room.capacity || room.maxGuests || 10)
    );
  };

  return {
    // State
    room,
    addons,
    loading,
    quantity,
    checkInDate,
    checkInTime,
    checkOutDate,
    checkOutTime,
    adults,
    children,
    selectedAddons,
    
    // Handlers
    setQuantity,
    handleDateTimeChange,
    handleGuestChange,
    handleAddonToggle,
    
    // Utils
    getBookingData,
    isBookingValid
  };
};