import React from 'react';
import { ProposalStatus, STATUS_CONFIG } from '@shared/statusSystem';

interface StatusBadgeProps {
  status: ProposalStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = STATUS_CONFIG[status];
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color} ${config.bgColor} ${config.textColor} ${className}`}
      title={config.description}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;