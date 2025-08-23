import { Check } from 'lucide-react';
import SectionTitle from './SectionTitle';

const Amenities = ({ features }) => {
  if (!features || features.length === 0) {
    return (
      <div>
        <SectionTitle title="Tiện nghi" />
        <p className="text-sm text-slate-500">Chưa có tiện nghi nào</p>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle title="Tiện nghi" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, idx) => {
          // Nếu f là object có featureName, dùng f.featureName
          // Nếu f là string, dùng luôn f
          const name = typeof f === 'string' ? f.trim() : f.featureName?.trim();

          if (!name) return null; // bỏ qua nếu không có text

          return (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
            >
              <Check className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-slate-700">{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Amenities;
