import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-white rounded-2xl p-4 md:p-6 border border-brand-black/5 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {children}
    </div>
  );
};
