/**
 * Theme constants for the Image-to-PDF app.
 * All components must use these tokens — no hardcoded colors, spacing, or layout values.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1A2E',
    background: '#F8F9FB',
    backgroundElement: '#EDEEF2',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#6B7280',
    accent: '#6366F1',
    accentLight: '#A5B4FC',
    accentSoft: 'rgba(99, 102, 241, 0.10)',
    success: '#10B981',
    successSoft: 'rgba(16, 185, 129, 0.10)',
    warning: '#F59E0B',
    warningSoft: 'rgba(245, 158, 11, 0.10)',
    danger: '#EF4444',
    dangerSoft: 'rgba(239, 68, 68, 0.10)',
    border: '#E5E7EB',
    overlay: 'rgba(0, 0, 0, 0.5)',
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    icon: '#6B7280',
    iconActive: '#6366F1',
  },
  dark: {
    text: '#F1F5F9',
    background: '#0F0F14',
    backgroundElement: '#1A1A24',
    backgroundSelected: '#252532',
    textSecondary: '#94A3B8',
    accent: '#818CF8',
    accentLight: '#6366F1',
    accentSoft: 'rgba(129, 140, 248, 0.12)',
    success: '#34D399',
    successSoft: 'rgba(52, 211, 153, 0.12)',
    warning: '#FBBF24',
    warningSoft: 'rgba(251, 191, 36, 0.12)',
    danger: '#F87171',
    dangerSoft: 'rgba(248, 113, 113, 0.12)',
    border: '#2D2D3A',
    overlay: 'rgba(0, 0, 0, 0.7)',
    card: '#16161F',
    cardElevated: '#1E1E2A',
    icon: '#94A3B8',
    iconActive: '#818CF8',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
} as const;

