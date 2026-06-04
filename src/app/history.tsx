/**
 * History Screen
 *
 * Lists previously generated PDFs stored locally on the device.
 * Users can share, delete individual records, or clear all history.
 */

import React from 'react';
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
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { useTheme } from '@/hooks/use-theme';
import { formatFileSize } from '@/utils/fileHelpers';
import { sharePdf } from '@/utils/fileHelpers';
import type { PdfRecord } from '@/hooks/usePdfHistory';

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function HistoryScreen() {
  const theme = useTheme();
  const { records, isHistoryLoading, removeRecord, clearHistory } = usePdfGenerator();

  // ---- Handlers ----

  const handleShare = async (record: PdfRecord) => {
    try {
      await sharePdf(record.filePath);
    } catch {
      Alert.alert('Error', 'Could not share this PDF. The file may have been deleted.');
    }
  };

  const handleDelete = (record: PdfRecord) => {
    Alert.alert('Delete PDF', `Delete "${record.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeRecord(record.id),
      },
    ]);
  };

  const handleClearAll = () => {
    if (records.length === 0) return;
    Alert.alert(
      'Clear History',
      'Delete all generated PDFs and clear history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearHistory },
      ],
    );
  };

  // ---- Helpers ----

  const formatDate = (isoString: string): string => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ---- Render ----

  const renderItem = ({ item }: { item: PdfRecord }) => (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {/* PDF icon */}
      <View style={[styles.pdfIcon, { backgroundColor: theme.dangerSoft }]}>
        <Ionicons name="document-text" size={24} color={theme.danger} />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <ThemedText numberOfLines={1} style={[styles.fileName, { color: theme.text }]}>
          {item.name}
        </ThemedText>
        <ThemedText style={[styles.meta, { color: theme.textSecondary }]}>
          {formatDate(item.createdAt)} · {formatFileSize(item.fileSize)}
        </ThemedText>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <Pressable
          onPress={() => handleShare(item)}
          style={({ pressed }) => [
            styles.iconButton,
            { backgroundColor: theme.accentSoft, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="share-outline" size={18} color={theme.accent} />
        </Pressable>
        <Pressable
          onPress={() => handleDelete(item)}
          style={({ pressed }) => [
            styles.iconButton,
            { backgroundColor: theme.dangerSoft, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Ionicons name="trash-outline" size={18} color={theme.danger} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText style={[styles.title, { color: theme.text }]}>
              History
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
              {records.length > 0
                ? `${records.length} PDF${records.length > 1 ? 's' : ''} generated`
                : 'No PDFs yet'}
            </ThemedText>
          </View>

          {records.length > 0 && (
            <Pressable
              onPress={handleClearAll}
              style={({ pressed }) => [
                styles.clearAllButton,
                { backgroundColor: theme.dangerSoft, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name="trash" size={14} color={theme.danger} />
              <ThemedText style={[styles.clearAllText, { color: theme.danger }]}>
                Clear All
              </ThemedText>
            </Pressable>
          )}
        </View>

        {/* List */}
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !isHistoryLoading ? (
              <EmptyState
                icon="time-outline"
                title="No History"
                description="Generated PDFs will appear here. You can share or delete them at any time."
              />
            ) : null
          }
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.two }} />}
        />
      </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.full,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.three,
  },
  pdfIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '700',
  },
  meta: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
