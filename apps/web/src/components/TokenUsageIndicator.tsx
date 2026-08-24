import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';

export const TokenUsageIndicator: React.FC = () => {
  const { tokenUsageUsed, tokenUsageLimit, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) return null;

  const remaining = tokenUsageLimit - tokenUsageUsed;
  const percentage = tokenUsageLimit > 0 ? (remaining / tokenUsageLimit) * 100 : 100;

  let colorClass = 'text-muted-foreground bg-muted border-border';
  if (percentage < 20 && percentage > 0) {
    colorClass = 'text-warning bg-warning/10 border-warning/20';
  } else if (remaining <= 0) {
    colorClass = 'text-destructive bg-destructive/10 border-destructive/20 animate-pulse';
  }

  return (
    <Link
      to="/billing"
      className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-badge border transition-colors ${colorClass}`}
    >
      <Cpu className="w-3.5 h-3.5" />
      <span>
        {remaining} / {tokenUsageLimit} Credits
      </span>
    </Link>
  );
};
