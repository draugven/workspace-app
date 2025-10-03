// Utility functions for handling colors in the UI

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Get a light version of a hex color for backgrounds (with opacity)
 */
export function getLightBackgroundColor(hexColor?: string, opacity = 0.1): string {
  if (!hexColor) return 'transparent';

  const rgb = hexToRgb(hexColor);
  if (!rgb) return 'transparent';

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Get text color (dark or light) that contrasts well with the background
 */
export function getContrastingTextColor(hexColor?: string): string {
  if (!hexColor) return '#374151'; // Default gray text

  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#374151';

  // Calculate relative luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  // Return white text for dark backgrounds, dark text for light backgrounds
  return luminance > 0.5 ? '#1f2937' : '#f9fafb';
}

/**
 * Get a medium opacity version of the color for badges
 */
export function getBadgeStyle(hexColor?: string) {
  if (!hexColor) return {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    borderColor: '#e5e7eb'
  };

  const rgb = hexToRgb(hexColor);
  if (!rgb) return {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    borderColor: '#e5e7eb'
  };

  return {
    backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`,
    color: hexColor,
    borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`
  };
}