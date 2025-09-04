// src/pages/Cart.jsx - Fixed version
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { CartContext } from '../context/CartContext';
import { Trash2, Plus, Minus, Calendar, Users, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartItem, clearCart } = useContext(CartContext);
  const [selectedItems, setSelectedItems] = useState(new Set());
  
  // Initialize selected items when cart loads
  useEffect(() => {
    if (cart && cart.length > 0) {
      setSelectedItems(new Set(cart.map(item => item.id)));
    }
  }, [cart]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      // Remove from selected items if deleted
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      return;
    }

    const item = cart.find(item => item.id === itemId);
    if (!item) return;

    // Calculate pricing properly
    const nights = item.nights || 1;
    const roomPrice = Number(item.room?.price) || 0;
    const roomTotal = nights * newQuantity * roomPrice;
    
    // Calculate addons total
    const addonsTotal = (item.selectedAddons || []).reduce((total, addon) => {
      return total + (Number(addon.price) * (addon.quantity || 1));
    }, 0);
    
    const subtotal = roomTotal + addonsTotal;
    const tax = subtotal * 0.1;
    const totalPrice = subtotal + tax;

    // Update the item
    updateCartItem(itemId, {
      quantity: newQuantity,
      roomTotal,
      addonsTotal,
      totalPrice
    });
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set()); // Unselect all
    } else {
      setSelectedItems(new Set(cart.map(item => item.id))); // Select all
    }
  };

  const getSelectedItems = () => {
    return cart.filter(item => selectedItems.has(item.id));
  };

  const getSelectedTotalPrice = () => {
    return getSelectedItems().reduce((total, item) => {
      const itemTotal = Number(item.totalPrice) || 0;
      return total + itemTotal;
    }, 0);
  };

  const handleCheckout = () => {
    const selectedItemsArray = getSelectedItems();
    if (selectedItemsArray.length === 0) {
      alert('Vui lòng chọn ít nhất một mục để thanh toán');
      return;
    }

    const totalAmount = getSelectedTotalPrice();

    // Lấy bookingId từ item (hoặc từ context nếu bạn có sẵn)
    const bookingId = selectedItemsArray[0].id;
    if (!bookingId) {
    alert("Không tìm thấy bookingId trong giỏ hàng");
    return;
  }

    navigate('/payment', { 
      state: { cartItems: selectedItemsArray, totalAmount, bookingId }
    });
  };

  // Helper function to get image URL
  const getRoomImage = (item) => {
    // Try different possible image sources
    if (item.room?.image) return item.room.image;
    if (item.room?.roomImagePaths?.[0]) return item.room.roomImagePaths[0];
    if (item.roomImagePaths?.[0]) return item.roomImagePaths[0];
    return '/placeholder.jpg';
  };

  // Helper function to safely get price
  const getRoomPrice = (item) => {
    const price = Number(item.room?.price) || Number(item.roomPrice) || 0;
    return price;
  };

  // Helper function to safely get total price
  const getItemTotalPrice = (item) => {
    const total = Number(item.totalPrice) || 0;
    return total;
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Bạn chưa có đặt phòng nào trong giỏ hàng. Hãy khám phá các phòng tuyệt vời của chúng tôi!
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 mx-auto px-6 py-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Tiếp tục đặt phòng
            </Button>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Giỏ hàng của bạn</h1>
              <p className="text-gray-600">{cart.length} mục đặt phòng • {selectedItems.size} được chọn</p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleSelectAll}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                {selectedItems.size === cart.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </Button>
              <Button 
                variant="outline" 
                onClick={clearCart}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Xóa tất cả
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const roomPrice = getRoomPrice(item);
                const totalPrice = getItemTotalPrice(item);
                const roomImage = getRoomImage(item);
                
                return (
                  <div key={item.id} className={`bg-white rounded-lg border p-6 transition-all ${
                    selectedItems.has(item.id) 
                      ? 'border-blue-300 ring-2 ring-blue-100' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    
                    {/* Selection Checkbox + Room Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleItemSelect(item.id)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <img 
                          src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCI_mI-HBIrmloyHsQCGaC_GWK43dAiqD6Bw&s'}
                          alt={item.room?.name || 'Room'}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCI_mI-HBIrmloyHsQCGaC_GWK43dAiqD6Bw&s';
                          }}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {item.room?.name || 'Phòng Deluxe'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {roomPrice > 0 ? `${roomPrice.toLocaleString('vi-VN')}₫/đêm` : 'Liên hệ'}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
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
                          {item.checkInDate || 'Chưa chọn'} → {item.checkOutDate || 'Chưa chọn'} 
                          {item.nights && ` (${item.nights} đêm)`}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>
                          {item.adults || 1} người lớn
                          {item.children > 0 && `, ${item.children} trẻ em`}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Số phòng:</span>
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-semibold bg-gray-50">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-600">
                          {totalPrice > 0 ? `${totalPrice.toLocaleString('vi-VN')}₫` : 'NaN₫'}
                        </p>
                        {selectedItems.has(item.id) && (
                          <p className="text-xs text-green-600">✓ Sẽ thanh toán</p>
                        )}
                      </div>
                    </div>

                    {/* Addons */}
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <div className="border-t border-gray-100 pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          Dịch vụ thêm:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.selectedAddons.map((addon, index) => (
                            <div key={addon.id || index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg text-sm">
                              <span className="text-blue-800 font-medium">
                                {addon.addonName || addon.name} x{addon.quantity || 1}
                              </span>
                              <span className="font-semibold text-blue-600">
                                {(Number(addon.price) * (addon.quantity || 1)).toLocaleString('vi-VN')}₫
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Cart Summary - Sticky */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                  Tóm tắt thanh toán
                </h3>
                
                {selectedItems.size > 0 ? (
                  <>
                    <div className="space-y-3 mb-6">
                      {getSelectedItems().map((item) => {
                        const totalPrice = getItemTotalPrice(item);
                        return (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {item.room?.name || 'Phòng'} x{item.quantity || 1}
                            </span>
                            <span className="font-medium">
                              {totalPrice > 0 ? `${totalPrice.toLocaleString('vi-VN')}₫` : '0₫'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Tổng cộng</span>
                        <span className="text-blue-600">
                          {getSelectedTotalPrice().toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
                    >
                      Thanh toán ({selectedItems.size} mục)
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Chưa chọn mục nào để thanh toán</p>
                    <p className="text-sm text-gray-400">Vui lòng chọn ít nhất một mục</p>
                  </div>
                )}

                <button
                  onClick={() => navigate('/')}
                  className="w-full mt-3 py-2 text-center text-blue-600 hover:underline transition-colors"
                >
                  Tiếp tục đặt phòng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;