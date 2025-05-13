'use client';

interface LicenseIndicatorProps {
  violations: number;
  className?: string;
  showDetails?: boolean;
}

export function LicenseIndicator({ 
  violations, 
  className = '',
  showDetails = true
}: LicenseIndicatorProps) {
  // Determine status level
  const getStatus = () => {
    if (violations === 0) return 'compliant';
    if (violations < 3) return 'warning';
    return 'violation';
  };
  
  // Get color based on status
  const getColor = () => {
    const status = getStatus();
    if (status === 'compliant') return 'var(--db-circuit-blue)';
    if (status === 'warning') return '#F59E0B'; // Amber
    return 'var(--db-lightning-red)';
  };
  
  // Get label based on status
  const getLabel = () => {
    const status = getStatus();
    if (status === 'compliant') return 'License Compliant';
    if (status === 'warning') return 'License Concerns';
    return 'License Violations';
  };
  
  // Get message based on status
  const getMessage = () => {
    const status = getStatus();
    if (status === 'compliant') {
      return 'All licenses are compliant with your policies.';
    }
    if (status === 'warning') {
      return `${violations} potential license ${violations === 1 ? 'concern' : 'concerns'} detected.`;
    }
    return `${violations} license ${violations === 1 ? 'violation' : 'violations'} detected.`;
  };
  
  const color = getColor();
  
  return (
    <div className={`rounded-lg p-4 bg-db-card-highlight db-border-highlight ${className}`}>
      <div className="flex items-center">
        <div 
          className="w-3 h-3 rounded-full mr-3"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}` 
          }}
        />
        <div className="flex-1">
          <div className="text-db-text-light font-medium text-sm">{getLabel()}</div>
          {showDetails && (
            <div className="text-db-text-medium text-xs mt-1">{getMessage()}</div>
          )}
        </div>
        {violations > 0 && (
          <div 
            className="text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center" 
            style={{ 
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}` 
            }}
          >
            {violations}
          </div>
        )}
      </div>
    </div>
  );
} 