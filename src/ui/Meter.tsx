import React from 'react';

interface MeterProps {
  type: 'cash' | 'value' | 'slice';
  value: number | null;
}

export const Meter: React.FC<MeterProps> = ({ type, value }) => {
  const configs = {
    cash: {
      label: 'Cash',
      icon: '💰',
      borderColor: 'border-[#4ADE80]', // mint
      bgTint: 'bg-[#DCFCE7]',
      textColor: 'text-[#166534]',
      format: (v: number) => `$${v}`,
    },
    value: {
      label: 'Value',
      icon: '💎',
      borderColor: 'border-[#8B5CF6]', // grape
      bgTint: 'bg-[#EDE9FE]',
      textColor: 'text-[#5B21B6]',
      format: (v: number) => `$${v}`,
    },
    slice: {
      label: 'Slice',
      icon: '🥧',
      borderColor: 'border-[#FF9F1C]', // orange
      bgTint: 'bg-[#FFEDD5]',
      textColor: 'text-[#9A3412]',
      format: (v: number) => `${v}%`,
    },
  };

  const config = configs[type];
  const displayVal = value !== null && value !== undefined ? config.format(value) : '—';

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded-[12px] border-2 border-[#2B2D42] bg-white shadow-[0_2px_0_rgba(43,45,66,0.2)]`}
    >
      <span className="text-base select-none" aria-hidden="true">
        {config.icon}
      </span>
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2B2D42]/70">
          {config.label}
        </span>
        <span className="font-extrabold text-sm sm:text-base tabular-nums text-[#2B2D42]">
          {displayVal}
        </span>
      </div>
    </div>
  );
};
