/**
 * useTheme Hook
 *
 * Returns the current color palette from theme.ts based on the device's
 * light/dark mode setting.
 */

import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export function useTheme() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? 'dark' : 'light';

  return Colors[theme];
}
