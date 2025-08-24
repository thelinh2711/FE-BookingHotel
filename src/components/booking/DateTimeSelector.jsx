import React from 'react';
import { Calendar } from 'lucide-react';

const DateTimeSelector = ({ 
  checkInDate, 
  checkInTime, 
  checkOutDate, 
  checkOutTime, 
  onChange 
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Chọn ngày và giờ</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Check In */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Nhận phòng
          </h4>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Ngày</label>
            <input
              type="date"
              value={checkInDate}
              min={today}
              onChange={(e) => onChange('checkInDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Giờ</label>
            <select
              value={checkInTime}
              onChange={(e) => onChange('checkInTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="14:00">14:00 (2:00 PM)</option>
              <option value="15:00">15:00 (3:00 PM)</option>
              <option value="16:00">16:00 (4:00 PM)</option>
              <option value="17:00">17:00 (5:00 PM)</option>
              <option value="18:00">18:00 (6:00 PM)</option>
              <option value="19:00">19:00 (7:00 PM)</option>
              <option value="20:00">20:00 (8:00 PM)</option>
              <option value="21:00">21:00 (9:00 PM)</option>
            </select>
          </div>
        </div>

        {/* Check Out */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Trả phòng
          </h4>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Ngày</label>
            <input
              type="date"
              value={checkOutDate}
              min={checkInDate || today}
              onChange={(e) => onChange('checkOutDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Giờ</label>
            <select
              value={checkOutTime}
              onChange={(e) => onChange('checkOutTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="11:00">11:00 (11:00 AM)</option>
              <option value="12:00">12:00 (12:00 PM)</option>
              <option value="13:00">13:00 (1:00 PM)</option>
            </select>
          </div>
        </div>
      </div>
      
      {checkInDate && checkOutDate && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Tổng số đêm: {Math.max(0, Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)))} đêm
          </p>
        </div>
      )}
    </div>
  );
};

export default DateTimeSelector;