'use client';

import { useEffect, useState } from 'react';

interface SeverityData {
  label: string;
  value: number;
  color: string;
}

interface SeverityChartProps {
  data: SeverityData[];
  maxValue?: number;
  className?: string;
  animate?: boolean;
}

export function SeverityChart({ 
  data, 
  maxValue,
  className = '',
  animate = true
}: SeverityChartProps) {
  const [animatedData, setAnimatedData] = useState<SeverityData[]>(
    data.map(item => ({ ...item, value: 0 }))
  );
  
  // Calculate the max value if not provided
  const calculatedMax = maxValue || Math.max(...data.map(item => item.value), 1);
  
  // Animate the bars on mount
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimatedData(data);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimatedData(data);
    }
  }, [data, animate]);
  
  return (
    <div className={`w-full space-y-3 ${className}`}>
      {animatedData.map((item, index) => {
        const percentage = (item.value / calculatedMax) * 100;
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-db-text-light font-medium">{item.label}</span>
              <span className="text-db-text-medium">{item.value}</span>
            </div>
            <div className="h-2.5 w-full bg-db-card-highlight rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${percentage}%`, 
                  backgroundColor: item.color,
                  transition: animate ? 'width 1s ease-out' : 'none'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function getDefaultSeverityData(cveCount: number): SeverityData[] {
  // Default distribution based on typical patterns
  return [
    { 
      label: 'Critical', 
      value: Math.round(cveCount * 0.1), // ~10% are critical
      color: 'var(--db-lightning-red)'
    },
    { 
      label: 'High', 
      value: Math.round(cveCount * 0.2), // ~20% are high
      color: '#F59E0B' // Amber
    },
    { 
      label: 'Medium', 
      value: Math.round(cveCount * 0.3), // ~30% are medium
      color: '#3B82F6' // Blue
    },
    { 
      label: 'Low', 
      value: Math.round(cveCount * 0.4), // ~40% are low
      color: '#10B981' // Green
    }
  ];
} 