import React from 'react';

type StatusType = 'open_paid' | 'warning' | 'delayed';

interface StatusBadgeProps {
  type: StatusType;
  label: string;
}

export const StatusBadge = ({ type, label }: StatusBadgeProps) => {
  const styles = {
    open_paid: 'bg-status-success/15 text-status-success border-status-success/30',
    warning: 'bg-status-warning/15 text-status-warning border-status-warning/30',
    delayed: 'bg-status-danger/15 text-status-danger border-status-danger/30',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${styles[type]}`}>
      <span className="w-2 h-2 rounded-full bg-current mr-1.5 animate-pulse" />
      {label}
    </span>
  );
};
