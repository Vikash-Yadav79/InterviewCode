// src/theme/colors.ts
export const Colors = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0056B3',
  primaryLight: '#66B0FF',
  
  // Secondary colors
  secondary: '#5856D6',
  secondaryDark: '#3A3A9C',
  
  // Success colors
  success: '#4CAF50',
  successDark: '#388E3C',
  
  // Warning colors
  warning: '#FFA500',
  warningDark: '#CC8400',
  
  // Danger/Error colors
  danger: '#FF3B30',
  dangerDark: '#CC2F26',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F5F5F5',
  gray200: '#E0E0E0',
  gray300: '#BDBDBD',
  gray400: '#9E9E9E',
  gray500: '#757575',
  gray600: '#616161',
  gray700: '#424242',
  gray800: '#212121',
  
  // Background colors
  background: '#F5F5F5',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',
  
  // Border colors
  border: '#DDDDDD',
  borderLight: '#EEEEEE',
  
  // Status colors
  info: '#2196F3',
  infoDark: '#1976D2',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export type ColorType = typeof Colors;