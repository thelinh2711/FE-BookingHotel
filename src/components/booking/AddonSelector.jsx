// src/components/booking/AddonSelector.jsx - Updated with quantity
import React from 'react';
import { ShoppingBag, Plus, Minus } from 'lucide-react';

const AddonSelector = ({ addons, selectedAddons, onAddonChange }) => {
  // Lọc chỉ các addon active
  const activeAddons = addons?.filter(addon => addon.active) || [];

  if (!activeAddons || activeAddons.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Dịch vụ thêm
        </h3>
        <p className="text-gray-500">Không có dịch vụ thêm nào</p>
      </div>
    );
  }

  // Map icon dựa trên tên addon
  const getAddonIcon = (addonName) => {
    const name = addonName.toLowerCase();
    if (name.includes('xe') || name.includes('đưa') || name.includes('đón') || name.includes('pickup')) return '🚗';
    if (name.includes('massage') || name.includes('spa')) return '💆‍♀️';
    if (name.includes('tour') || name.includes('thăm')) return '🏛️';
    if (name.includes('tối') || name.includes('ăn') || name.includes('buffet') || name.includes('breakfast')) return '🍽️';
    if (name.includes('thuê') || name.includes('xe máy')) return '🏍️';
    if (name.includes('check') || name.includes('muộn')) return '🕕';
    if (name.includes('wifi')) return '📶';
    if (name.includes('giặt')) return '👕';
    if (name.includes('thể thao') || name.includes('gym')) return '💪';
    return '⭐'; // Default icon
  };

  const getAddonQuantity = (addonId) => {
    const selectedAddon = selectedAddons.find(item => item.id === addonId);
    return selectedAddon ? selectedAddon.quantity : 0;
  };

  const handleQuantityChange = (addonId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove addon if quantity is 0
      const updatedAddons = selectedAddons.filter(item => item.id !== addonId);
      onAddonChange(updatedAddons);
    } else {
      const addon = activeAddons.find(a => a.id === addonId);
      const existingIndex = selectedAddons.findIndex(item => item.id === addonId);
      
      let updatedAddons = [...selectedAddons];
      
      if (existingIndex >= 0) {
        // Update existing addon quantity
        updatedAddons[existingIndex] = {
          ...updatedAddons[existingIndex],
          quantity: newQuantity
        };
      } else {
        // Add new addon with quantity
        updatedAddons.push({
          id: addonId,
          addonName: addon.addonName,
          price: addon.price,
          description: addon.description,
          quantity: newQuantity
        });
      }
      
      onAddonChange(updatedAddons);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5" />
        Dịch vụ thêm
      </h3>
      
      <div className="space-y-4">
        {activeAddons.map((addon) => {
          const quantity = getAddonQuantity(addon.id);
          
          return (
            <div key={addon.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{getAddonIcon(addon.addonName)}</span>
                    <h4 className="font-medium text-gray-800">{addon.addonName}</h4>
                  </div>
                  
                  {addon.description && (
                    <p className="text-sm text-gray-600 mb-3">{addon.description}</p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-blue-600">
                      {Number(addon.price).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 ml-4">
                  <button
                    onClick={() => handleQuantityChange(addon.id, quantity - 1)}
                    disabled={quantity <= 0}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <span className="w-8 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  
                  <button
                    onClick={() => handleQuantityChange(addon.id, quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Subtotal for this addon */}
              {quantity > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Tổng: {quantity} x {Number(addon.price).toLocaleString('vi-VN')}₫
                    </span>
                    <span className="font-semibold text-blue-600">
                      {(quantity * Number(addon.price)).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedAddons.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-sm text-blue-700 font-medium">
              Đã chọn {selectedAddons.length} dịch vụ thêm
            </p>
            <p className="font-semibold text-blue-700">
              Tổng: {selectedAddons.reduce((total, item) => total + (Number(item.price) * item.quantity), 0).toLocaleString('vi-VN')}₫
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddonSelector;