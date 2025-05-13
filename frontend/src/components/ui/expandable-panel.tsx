'use client';

import { ReactNode, useState } from 'react';

interface ExpandablePanelProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: ReactNode;
  className?: string;
  level?: 'info' | 'warning' | 'critical' | 'none';
}

export function ExpandablePanel({
  title,
  children,
  defaultOpen = false,
  badge,
  className = '',
  level = 'none'
}: ExpandablePanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // Get color based on level
  const getLevelColor = () => {
    switch (level) {
      case 'critical':
        return 'var(--db-lightning-red)';
      case 'warning':
        return '#F59E0B'; // Amber
      case 'info':
        return 'var(--db-circuit-blue)';
      default:
        return 'var(--db-text-light)';
    }
  };
  
  const borderColor = level !== 'none' 
    ? { borderLeft: `3px solid ${getLevelColor()}` }
    : {};
  
  return (
    <div 
      className={`db-card overflow-hidden mb-3 ${className}`}
      style={borderColor}
    >
      <button
        className="w-full flex items-center justify-between p-3 text-left focus:outline-none focus:ring-2 focus:ring-db-docker-blue"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div 
            className={`w-4 h-4 mr-2 flex items-center justify-center transition-transform duration-200 ease-in-out ${isOpen ? 'transform rotate-90' : ''}`}
          >
            <svg
              width="6"
              height="10"
              viewBox="0 0 6 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 1L5 5L1.5 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span 
            className="text-sm font-medium"
            style={{ color: level !== 'none' ? getLevelColor() : 'var(--db-text-light)' }}
          >
            {title}
          </span>
        </div>
        {badge && <div>{badge}</div>}
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-3 pt-0 text-db-text-medium text-sm border-t border-db-card-highlight">
          {children}
        </div>
      </div>
    </div>
  );
} 