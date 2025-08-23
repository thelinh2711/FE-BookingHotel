import { BedDouble, Users, Bath, Home } from "lucide-react";
import SectionTitle from "./SectionTitle";

const RoomFeatures = ({ room }) => {
  if (!room) return null;
  return (
    <div>
      <SectionTitle title="Đặc điểm phòng" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Giường */}
        <div className="flex items-center gap-3">
          <BedDouble className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium text-slate-900">Beds</div>
            <div className="text-sm text-slate-500">
              {room.bedTypes?.length > 0
                ? room.bedTypes.join(", ")
                : "Thông tin giường chưa có"}
            </div>
          </div>
        </div>

        {/* Sức chứa */}
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium text-slate-900">Guests</div>
            <div className="text-sm text-slate-500">
              Tối đa {room.capacity || "?"} khách
            </div>
          </div>
        </div>

        {/* Số lượng phòng */}
        <div className="flex items-center gap-3">
          <Home className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium text-slate-900">Available Rooms</div>
            <div className="text-sm text-slate-500">
              {room.quantity ?? "?"} phòng
            </div>
          </div>
        </div>

        {/* Giá */}
        <div className="flex items-center gap-3">
          <Bath className="w-5 h-5 text-blue-600" />
          <div>
            <div className="font-medium text-slate-900">Price</div>
            <div className="text-sm text-slate-500">
              {room.price
                ? `${room.price.toLocaleString("vi-VN")} VND / đêm`
                : "Liên hệ"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomFeatures;
