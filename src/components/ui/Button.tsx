import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  // Base com no mínimo 44px de altura (h-11)
  const baseStyles = "min-h-[44px] px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-brand-yellow text-brand-black hover:brightness-105 shadow-md shadow-brand-yellow/20",
    secondary: "bg-brand-black text-white hover:bg-black/90 shadow-md",
    outline: "border-2 border-brand-black text-brand-black hover:bg-brand-black/5"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
