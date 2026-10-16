import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Toggle = ({ checked, onChange, label }: ToggleProps) => {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer min-h-[44px] select-none">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-12 h-7 bg-brand-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-yellow relative"></div>
      {label && <span className="text-sm font-semibold text-brand-black">{label}</span>}
    </label>
  );
};
