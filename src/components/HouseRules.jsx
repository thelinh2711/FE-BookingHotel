import { Check } from 'lucide-react';
import SectionTitle from './SectionTitle';

const HouseRules = () => {
  const rules = [
    {
      title: 'Check-in: 2:00 PM - 10:00 PM',
      subtitle: 'Self check-in with keypad'
    },
    {
      title: 'Check-out: Before 11:00 AM',
      subtitle: null
    },
    {
      title: 'No smoking',
      subtitle: null
    },
    {
      title: 'No parties or events',
      subtitle: null
    },
    {
      title: 'Pets allowed',
      subtitle: 'With prior approval'
    }
  ];

  return (
    <div>
      <SectionTitle title="House Rules" />
      <div className="space-y-3">
        {rules.map((rule, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <div className="font-medium text-slate-900">{rule.title}</div>
              {rule.subtitle && (
                <div className="text-sm text-slate-500">{rule.subtitle}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HouseRules;