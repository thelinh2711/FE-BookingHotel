import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import Button from '../Button';
import { Trash2, Plus, Minus, Calendar, Users, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('bookingCart') || '[]');
    setCartItems(cart);
  }, []);

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('bookingCart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        const nights = item.nights;
        const roomTotal = nights * newQuantity * (item.room?.price || 0);
        const addonsTotal = item.addonsTotal; // Keep addons same
        const subtotal = roomTotal + addonsTotal;
        const tax = subtotal * 0.1;
        const totalPrice = subtotal + tax;

        return {
          ...item,
          quantity: newQuantity,
          roomTotal,
          totalPrice
        };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem('bookingCart', JSON.stringify(updatedCart));
  };

  const getTotalCartPrice = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Giỏ hàng trống');
      return;
    }

    // Navigate to payment with all cart items
    navigate('/booking/payment', { 
      state: { cartItems }
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Button onClick={() => navigate('/')}>
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Giỏ hàng</h1>
          <p className="text-gray-600">Xem lại và chỉnh sửa đơn hàng của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-6">
                {/* Room Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.room?.image || item.room?.roomImagePaths?.[0]} 
                      alt={item.room?.name}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.room?.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.room?.price?.toLocaleString('vi-VN')}₫/đêm
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Xóa khỏi giỏ hàng"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {item.checkInDate} ({item.checkInTime}) → {item.checkOutDate} ({item.checkOutTime})
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>
                      {item.adults} người lớn{item.children > 0 && `, ${item.children} trẻ em`}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Số phòng:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600">{item.nights} đêm</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {item.totalPrice.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>

                {/* Addons */}
                {item.selectedAddonDetails && item.selectedAddonDetails.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Dịch vụ thêm:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.selectedAddonDetails.map((addon) => (
                        <div key={addon.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <span className="text-sm text-blue-800">{addon.addonName}</span>
                          <span className="text-sm font-medium text-blue-600">
                            {Number(addon.price).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-3 mb-6">
                {cartItems.map((item, index) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.room?.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {item.totalPrice.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">
                    {getTotalCartPrice().toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Thanh toán
              </Button>

              <button
                onClick={() => navigate('/')}
                className="w-full mt-3 py-2 text-center text-blue-600 hover:underline"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;