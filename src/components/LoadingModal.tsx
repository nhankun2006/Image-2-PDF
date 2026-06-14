/**
 * LoadingModal Component
 *
 * Full-screen blocking overlay shown during PDF generation.
 * Displays an animated progress bar and status text.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface LoadingModalProps {
  visible: boolean;
  progress: number; // 0..1
}

export function LoadingModal({ visible, progress }: LoadingModalProps) {
  const theme = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.6)).current;

  // Animate progress bar width
  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  // Pulse animation for the icon
  useEffect(() => {
    if (visible) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [visible, pulseAnim]);

  const percentage = Math.round(progress * 100);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View style={[styles.card, { backgroundColor: theme.cardElevated }]}>
          {/* Animated document icon */}
          <Animated.View style={[styles.iconContainer, { opacity: pulseAnim }]}>
            <View style={[styles.docIcon, { backgroundColor: theme.accent }]}>
              <ThemedText style={styles.docIconText}>PDF</ThemedText>
            </View>
          </Animated.View>

          <ThemedText style={styles.title}>
            Generating PDF…
          </ThemedText>

          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Processing your images
          </ThemedText>

          {/* Progress bar */}
          <View style={[styles.progressTrack, { backgroundColor: theme.backgroundElement }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.accent,
                  width: animatedWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <ThemedText themeColor="textSecondary" style={styles.percentage}>
            {percentage}%
          </ThemedText>
        </View>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconContainer: {
    marginBottom: Spacing.two,
  },
  docIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.three,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  percentage: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: Spacing.one,
  },
});
