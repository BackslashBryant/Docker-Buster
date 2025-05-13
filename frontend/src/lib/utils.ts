import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to format risk score into human-readable form
export function formatRiskScore(score: number) {
  if (score < 3) return { text: "Safe & Sound", color: "success" };
  if (score < 7) return { text: "Heads Up", color: "warning" };
  return { text: "Red Alert", color: "destructive" };
}

// Get color based on severity level
export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'var(--db-lightning-red)';
    case 'high':
      return '#F59E0B'; // Amber
    case 'medium':
      return '#3B82F6'; // Blue
    case 'low':
      return '#10B981'; // Green
    default:
      return 'var(--db-text-medium)';
  }
}

// Get badge variant based on severity
export function getSeverityVariant(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'success';
    default:
      return 'secondary';
  }
}

// Format a timestamp to a readable date
export function formatDate(timestamp: string | number | Date): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Truncate text with ellipsis if longer than maxLength
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Convert number of bytes to human-readable format
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

// Get recommendation priority based on severity
export function getRecommendationPriority(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'Immediate action required';
    case 'high':
      return 'Address as soon as possible';
    case 'medium':
      return 'Plan to address in next sprint';
    case 'low':
      return 'Address when convenient';
    default:
      return 'Review as needed';
  }
}
