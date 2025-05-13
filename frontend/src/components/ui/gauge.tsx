'use client';

import { useEffect, useState } from 'react';

interface CircularGaugeProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function CircularGauge({
  value,
  maxValue = 10,
  size = 150,
  strokeWidth = 10,
  label,
  showValue = true,
  className = '',
}: CircularGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [value]);
  
  // Calculate parameters
  const normalizedValue = Math.min(Math.max(animatedValue, 0), maxValue);
  const percentage = (normalizedValue / maxValue) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Color based on value
  const getColor = () => {
    const normalizedScore = normalizedValue / maxValue;
    if (normalizedScore < 0.3) return 'var(--db-circuit-blue)'; // Low risk
    if (normalizedScore < 0.7) return '#FCD34D'; // Medium risk
    return 'var(--db-lightning-red)'; // High risk
  };
  
  // Shadow based on value
  const getShadow = () => {
    const normalizedScore = normalizedValue / maxValue;
    if (normalizedScore < 0.3) return '0 0 10px rgba(15, 149, 214, 0.6)';
    if (normalizedScore < 0.7) return '0 0 10px rgba(252, 211, 77, 0.6)';
    return '0 0 10px rgba(229, 57, 53, 0.6)';
  };
  
  // Label based on value
  const getLabel = () => {
    const normalizedScore = normalizedValue / maxValue;
    if (normalizedScore < 0.3) return 'Low Risk';
    if (normalizedScore < 0.7) return 'Medium Risk';
    return 'High Risk';
  };
  
  const center = size / 2;
  const color = getColor();
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#102C45"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle with transition */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ 
              transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease',
              filter: `drop-shadow(${getShadow()})`
            }}
          />
        </svg>
        
        {/* Center value display */}
        {showValue && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center text-db-text-light font-bold"
            style={{ textShadow: `0 0 5px ${color}` }}
          >
            <span className="text-3xl" style={{ color }}>
              {animatedValue.toFixed(1)}
            </span>
            <span className="text-xs text-db-text-medium">/ {maxValue}</span>
          </div>
        )}
      </div>
      
      {/* Label below gauge */}
      {label ? (
        <div className="mt-2 text-center text-sm font-semibold" style={{ color }}>
          {label}
        </div>
      ) : (
        <div className="mt-2 text-center text-sm font-semibold" style={{ color }}>
          {getLabel()}
        </div>
      )}
    </div>
  );
} 