import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useBooking = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    // Thông tin khách hàng
    fullName: '',
    phone: '',
    email: '',
    notes: '',

    // Thông tin đặt phòng
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,

    // Phương thức thanh toán
    paymentMethod: 'credit-card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState({
    id: 1,
    name: "Deluxe Ocean View",
    price: 2500000,
    image: "/api/placeholder/400/300",
    amenities: ["Wifi miễn phí", "Bãi đậu xe", "Bữa sáng", "Hồ bơi"],
    maxGuests: 2
  });

  // Nhận dữ liệu từ navigation state
  useEffect(() => {
    if (location.state) {
      const { room, checkIn, checkOut, guests } = location.state;

      if (room) {
        setSelectedRoom(room);
      }

      setFormData(prev => ({
        ...prev,
        checkIn: checkIn || '',
        checkOut: checkOut || '',
        guests: guests || 1
      }));
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(4); // Chuyển đến bước xác nhận
    }, 2000);
  };

  const calculateTotal = () => {
    if (!formData.checkIn || !formData.checkOut) {
      return {
        nights: 0,
        roomTotal: 0,
        tax: 0,
        total: 0
      };
    }

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const roomTotal = selectedRoom.price * formData.rooms * nights;
    const tax = roomTotal * 0.1; // 10% thuế
    
    return {
      nights,
      roomTotal,
      tax,
      total: roomTotal + tax
    };
  };

  return {
    formData,
    currentStep,
    isSubmitting,
    selectedRoom,
    setCurrentStep,
    handleInputChange,
    handleSubmit,
    calculateTotal
  };
};
