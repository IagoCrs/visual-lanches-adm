import React from 'react';

interface CategoryChipProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export const CategoryChip = ({ label, icon, active = false, onClick }: CategoryChipProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 cursor-pointer group focus:outline-none transition-transform active:scale-95 min-w-[70px]"
    >
      {/* Círculo do Ícone */}
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm group-hover:shadow-md ${active
            ? 'bg-brand-yellow text-brand-black scale-105 shadow-md'
            : 'bg-white text-amber-500 hover:bg-amber-50/50 border border-black/5'
          }`}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          {icon}
        </div>
      </div>

      {/* Texto em Baixo */}
      <span
        className={`text-xs tracking-tight transition-colors ${active
            ? 'text-amber-600 font-bold'
            : 'text-gray-700 font-medium group-hover:text-black'
          }`}
      >
        {label}
      </span>
    </button>
  );
};
