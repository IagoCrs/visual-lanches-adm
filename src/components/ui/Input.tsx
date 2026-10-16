import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-semibold text-brand-black/80">{label}</label>
      <input
        className={`min-h-[44px] px-4 rounded-xl border border-brand-black/20 bg-white text-brand-black placeholder:text-brand-black/40 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-status-danger font-medium">{error}</span>}
    </div>
  );
};
