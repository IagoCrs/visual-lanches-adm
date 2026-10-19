import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  /** Nome lido pelo leitor de tela quando não há label visível */
  ariaLabel?: string;
  disabled?: boolean;
}

export const Toggle = ({ checked, onChange, label, ariaLabel, disabled = false }: ToggleProps) => {
  return (
    <label
      className={`inline-flex items-center gap-3 min-h-[44px] select-none ${
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      }`}
    >
      <input
        type="checkbox"
        role="switch"
        className="sr-only peer"
        checked={checked}
        disabled={disabled}
        aria-label={label ? undefined : ariaLabel}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-12 h-7 bg-brand-black/20 rounded-full peer peer-focus-visible:ring-2 peer-focus-visible:ring-brand-yellow peer-focus-visible:ring-offset-2 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-yellow relative"></div>
      {label && <span className="text-sm font-semibold text-brand-black">{label}</span>}
    </label>
  );
};
