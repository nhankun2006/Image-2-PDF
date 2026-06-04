/**
 * Home Screen — Image Management + PDF Generation
 *
 * Primary screen where users:
 *   1. Select images from gallery or camera
 *   2. Reorder, rotate, and delete images
 *   3. Configure PDF settings (page size, orientation, quality)
 *   4. Generate and share the PDF
 */

import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { EmptyState } from '@/components/EmptyState';
import { ImageCard } from '@/components/ImageCard';
import { LoadingModal } from '@/components/LoadingModal';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useImageList } from '@/hooks/useImageList';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { useTheme } from '@/hooks/use-theme';
import { PdfConfig } from '@/utils/pdf';
import { pickImagesFromGallery, takePhoto } from '@/utils/imageHelpers';

// ---------------------------------------------------------------------------
// Default PDF Config
// ---------------------------------------------------------------------------

const DEFAULT_CONFIG: PdfConfig = {
  pageSize: 'A4',
  orientation: 'Portrait',
  quality: 'High',
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function HomeScreen() {
  const theme = useTheme();
  const {
    images,
    addImages,
    removeImage,
    moveUp,
    moveDown,
    rotateImage,
    clearImages,
    count,
  } = useImageList();
  const { generate, isGenerating, progress } = usePdfGenerator();
  const [config, setConfig] = useState<PdfConfig>(DEFAULT_CONFIG);

  // ---- Handlers ----

  const handlePickGallery = async () => {
    const uris = await pickImagesFromGallery();
    if (uris.length > 0) addImages(uris);
  };

  const handleTakePhoto = async () => {
    const uris = await takePhoto();
    if (uris.length > 0) addImages(uris);
  };

  const handleGenerate = () => {
    generate(images, config);
  };

  const handleClear = () => {
    Alert.alert('Clear All', 'Remove all selected images?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearImages },
    ]);
  };

  // ---- Render helpers ----

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* App title */}
      <View style={styles.titleRow}>
        <View style={[styles.titleIcon, { backgroundColor: theme.accentSoft }]}>
          <Ionicons name="document-text" size={22} color={theme.accent} />
        </View>
        <View>
          <ThemedText style={[styles.appTitle, { color: theme.text }]}>
            Image to PDF
          </ThemedText>
          <ThemedText style={[styles.appSubtitle, { color: theme.textSecondary }]}>
            Convert images to PDF locally
          </ThemedText>
        </View>
      </View>

      {/* Source selection buttons */}
      <View style={styles.sourceRow}>
        <Pressable
          onPress={handlePickGallery}
          style={({ pressed }) => [
            styles.sourceButton,
            { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Ionicons name="images" size={20} color="#FFFFFF" />
          <ThemedText style={styles.sourceButtonText}>Gallery</ThemedText>
        </Pressable>

        <Pressable
          onPress={handleTakePhoto}
          style={({ pressed }) => [
            styles.sourceButton,
            styles.sourceButtonOutline,
            {
              backgroundColor: theme.accentSoft,
              borderColor: theme.accent,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Ionicons name="camera" size={20} color={theme.accent} />
          <ThemedText style={[styles.sourceButtonText, { color: theme.accent }]}>
            Camera
          </ThemedText>
        </Pressable>
      </View>

      {/* Image count + clear */}
      {count > 0 && (
        <View style={styles.countRow}>
          <View style={[styles.countBadge, { backgroundColor: theme.accentSoft }]}>
            <ThemedText style={[styles.countText, { color: theme.accent }]}>
              {count} image{count > 1 ? 's' : ''} selected
            </ThemedText>
          </View>
          <Pressable
            onPress={handleClear}
            style={({ pressed }) => [
              styles.clearButton,
              { backgroundColor: theme.dangerSoft, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="close-circle" size={16} color={theme.danger} />
            <ThemedText style={[styles.clearText, { color: theme.danger }]}>
              Clear
            </ThemedText>
          </Pressable>
        </View>
      )}
    </View>
  );

  const renderFooter = () => {
    if (count === 0) return null;
    return (
      <View style={styles.footerContent}>
        {/* Settings panel */}
        <SettingsPanel config={config} onConfigChange={setConfig} />

        {/* Generate button */}
        <Pressable
          onPress={handleGenerate}
          disabled={isGenerating}
          style={({ pressed }) => [
            styles.generateButton,
            {
              backgroundColor: theme.accent,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Ionicons name="sparkles" size={20} color="#FFFFFF" />
          <ThemedText style={styles.generateText}>Generate PDF</ThemedText>
        </Pressable>

        {/* Bottom spacer for tab bar */}
        <View style={{ height: Spacing.four }} />
      </View>
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <FlatList
          data={images}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <EmptyState
              icon="images-outline"
              title="No Images Yet"
              description="Tap Gallery or Camera above to add images you'd like to convert to PDF."
            />
          }
          renderItem={({ item, index }) => (
            <View style={styles.cardWrapper}>
              <ImageCard
                uri={item.uri}
                index={index}
                rotation={item.rotation}
                isFirst={index === 0}
                isLast={index === images.length - 1}
                onMoveUp={() => moveUp(index)}
                onMoveDown={() => moveDown(index)}
                onRotate={() => rotateImage(index)}
                onRemove={() => removeImage(index)}
              />
            </View>
          )}
        />
      </SafeAreaView>

      {/* Loading overlay */}
      <LoadingModal visible={isGenerating} progress={progress} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  headerContent: {
    gap: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  titleIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  appSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  sourceRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  sourceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.md,
  },
  sourceButtonOutline: {
    borderWidth: 1.5,
  },
  sourceButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countBadge: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: BorderRadius.full,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: BorderRadius.full,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
  },
  gridRow: {
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '50%',
  },
  footerContent: {
    gap: Spacing.three,
    paddingTop: Spacing.three,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: BorderRadius.md,
  },
  generateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
