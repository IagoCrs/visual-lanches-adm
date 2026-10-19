import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Algo à direita dentro do campo, ex.: botão de mostrar senha */
  trailing?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}

export const Input = ({ label, error, trailing, className = '', id, ...props }: InputProps) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-erro`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className="text-sm font-semibold text-brand-black/80">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`w-full min-h-[44px] px-4 rounded-xl border bg-white text-brand-black placeholder:text-brand-black/40 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${
            error ? 'border-red-500' : 'border-brand-black/20'
          } ${trailing ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {trailing && <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>}
      </div>
      {error && (
        <span id={errorId} role="alert" className="text-xs text-red-600 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};
