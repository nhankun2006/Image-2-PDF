/**
 * ImageCard Component
 *
 * Displays an image thumbnail with overlay action buttons for rotate,
 * move up, move down, and delete. Shows an index badge in the corner.
 */

import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ImageCardProps {
  uri: string;
  index: number;
  rotation: number;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onRemove: () => void;
}

export function ImageCard({
  uri,
  index,
  rotation,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onRotate,
  onRemove,
}: ImageCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {/* Thumbnail */}
      <View style={styles.thumbnailWrapper}>
        <Image
          source={{ uri }}
          style={[
            styles.thumbnail,
            { transform: [{ rotate: `${rotation}deg` }] },
          ]}
          resizeMode="cover"
        />
        {/* Index badge */}
        <View style={[styles.badge, { backgroundColor: theme.accent }]}>
          <ThemedText style={styles.badgeText}>{index + 1}</ThemedText>
        </View>
      </View>

      {/* Action buttons row */}
      <View style={styles.actions}>
        <ActionButton
          icon="arrow-up"
          onPress={onMoveUp}
          disabled={isFirst}
          color={theme.icon}
          disabledColor={theme.border}
          bgColor={theme.backgroundElement}
        />
        <ActionButton
          icon="arrow-down"
          onPress={onMoveDown}
          disabled={isLast}
          color={theme.icon}
          disabledColor={theme.border}
          bgColor={theme.backgroundElement}
        />
        <ActionButton
          icon="refresh"
          onPress={onRotate}
          color={theme.accent}
          bgColor={theme.accentSoft}
        />
        <ActionButton
          icon="trash-outline"
          onPress={onRemove}
          color={theme.danger}
          bgColor={theme.dangerSoft}
        />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Internal: ActionButton
// ---------------------------------------------------------------------------

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color: string;
  bgColor: string;
  disabled?: boolean;
  disabledColor?: string;
}

function ActionButton({ icon, onPress, color, bgColor, disabled, disabledColor }: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.actionButton,
        { backgroundColor: bgColor, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={disabled ? (disabledColor ?? '#666') : color}
      />
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  thumbnailWrapper: {
    position: 'relative',
    aspectRatio: 4 / 3,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two,
    width: 26,
    height: 26,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
    gap: Spacing.one,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
