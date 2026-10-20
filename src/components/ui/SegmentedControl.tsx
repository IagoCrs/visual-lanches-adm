import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  selected: string;
  onChange: (value: string) => void;
  /** Nome do grupo para leitor de tela, ex.: "Perfil" */
  ariaLabel?: string;
}

export const SegmentedControl = ({ options, selected, onChange, ariaLabel }: SegmentedControlProps) => {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex bg-brand-black/5 p-1 rounded-xl gap-1 min-h-[44px] items-center"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={selected === option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 min-h-[38px] py-1.5 px-3 rounded-lg text-sm font-semibold transition-all ${selected === option.value
              ? 'bg-white text-brand-black shadow-sm'
              : 'text-brand-black/60 hover:text-brand-black'
            }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
