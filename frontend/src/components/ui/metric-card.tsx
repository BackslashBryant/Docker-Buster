'use client';

import { ReactNode } from 'react';

interface MetricCardProps {
  value: number | string;
  label: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string; 
  className?: string;
  color?: string;
}

export function MetricCard({
  value,
  label,
  icon,
  trend,
  trendValue,
  className = '',
  color
}: MetricCardProps) {
  // Get trend color
  const getTrendColor = () => {
    if (!trend) return 'var(--db-text-medium)';
    
    switch (trend) {
      case 'up':
        return 'var(--db-lightning-red)';
      case 'down':
        return '#10B981'; // Green
      default:
        return '#F59E0B'; // Amber
    }
  };
  
  // Get trend icon
  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend === 'up') {
      return (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    
    if (trend === 'down') {
      return (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 16L12 21L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 21V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    
    return null;
  };
  
  return (
    <div className={`db-card p-4 flex flex-col ${className}`}>
      <div className="mb-2 text-xs text-db-text-medium flex items-center justify-between">
        <span className="flex items-center gap-1">
          {icon && <span>{icon}</span>}
          {label}
        </span>
        {trend && (
          <span 
            className="flex items-center gap-0.5"
            style={{ color: getTrendColor() }}
          >
            {getTrendIcon()}
            {trendValue}
          </span>
        )}
      </div>
      <div 
        className="text-2xl font-bold"
        style={{ color: color || 'var(--db-text-light)' }}
      >
        {value}
      </div>
    </div>
  );
} 