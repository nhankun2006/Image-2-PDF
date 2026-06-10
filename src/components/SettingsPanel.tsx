/**
 * SettingsPanel Component
 *
 * Collapsible panel with segmented controls for PDF configuration:
 *   - Page Size (A4 / Letter / Fit Image)
 *   - Orientation (Portrait / Landscape)
 *   - Quality (Low / Medium / High)
 */

import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import {
  type CompressionQuality,
  type Orientation,
  type PageSize,
  type PdfConfig,
} from '@/types/pdf';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SettingsPanelProps {
  config: PdfConfig;
  onConfigChange: (config: PdfConfig) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SettingsPanel({ config, onConfigChange }: SettingsPanelProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="settings-outline" size={18} color={theme.accent} />
        <ThemedText style={styles.headerText}>
          PDF Settings
        </ThemedText>
      </View>

      {/* Page Size */}
      <SettingRow label="Page Size" icon="document-outline" theme={theme}>
        <SegmentedControl<PageSize>
          options={['A4', 'Letter', 'FitImage']}
          labels={['A4', 'Letter', 'Fit Image']}
          selected={config.pageSize}
          onSelect={(v) => onConfigChange({ ...config, pageSize: v })}
          theme={theme}
        />
      </SettingRow>

      {/* Orientation */}
      <SettingRow label="Orientation" icon="phone-landscape-outline" theme={theme}>
        <SegmentedControl<Orientation>
          options={['Portrait', 'Landscape']}
          labels={['Portrait', 'Landscape']}
          selected={config.orientation}
          onSelect={(v) => onConfigChange({ ...config, orientation: v })}
          theme={theme}
          disabled={config.pageSize === 'FitImage'}
        />
      </SettingRow>

      {/* Quality */}
      <SettingRow label="Quality" icon="sparkles-outline" theme={theme}>
        <SegmentedControl<CompressionQuality>
          options={['Low', 'Medium', 'High']}
          labels={['Low', 'Medium', 'High']}
          selected={config.quality}
          onSelect={(v) => onConfigChange({ ...config, quality: v })}
          theme={theme}
        />
      </SettingRow>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Internal: SettingRow
// ---------------------------------------------------------------------------

interface SettingRowProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  theme: ReturnType<typeof useTheme>;
  children: React.ReactNode;
}

function SettingRow({ label, icon, theme, children }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLabel}>
        <Ionicons name={icon} size={16} color={theme.textSecondary} />
        <ThemedText themeColor="textSecondary" style={styles.labelText}>
          {label}
        </ThemedText>
      </View>
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Internal: SegmentedControl
// ---------------------------------------------------------------------------

interface SegmentedControlProps<T extends string> {
  options: T[];
  labels: string[];
  selected: T;
  onSelect: (value: T) => void;
  theme: ReturnType<typeof useTheme>;
  disabled?: boolean;
}

function SegmentedControl<T extends string>({
  options,
  labels,
  selected,
  onSelect,
  theme,
  disabled,
}: SegmentedControlProps<T>) {
  return (
    <View style={[styles.segmented, { backgroundColor: theme.backgroundElement }]}>
      {options.map((option, i) => {
        const isActive = option === selected;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            disabled={disabled}
            style={[
              styles.segment,
              isActive && { backgroundColor: theme.accent },
              disabled && styles.segmentDisabled,
            ]}
          >
            <ThemedText
              style={[
                styles.segmentText,
                { color: isActive ? '#FFFFFF' : theme.textSecondary },
                disabled && { opacity: 0.4 },
              ]}
            >
              {labels[i]}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  headerText: {
    fontSize: 15,
    fontWeight: '700',
  },
  settingRow: {
    gap: Spacing.two,
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '600',
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: BorderRadius.sm,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.xs + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentDisabled: {
    opacity: 0.4,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
