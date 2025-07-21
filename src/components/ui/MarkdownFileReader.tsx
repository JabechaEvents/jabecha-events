import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Text } from 'react-native-paper';
import { useMarkdownFile } from '../../hooks/useMarkdownFile';
import MarkdownViewer from './MarkdownViewer';

interface MarkdownFileReaderProps {
  filePath: string;
  title?: string;
  style?: any;
}

export const MarkdownFileReader: React.FC<MarkdownFileReaderProps> = ({ 
  filePath, 
  title,
  style 
}) => {
  const { content, title: fileTitle, loading, error } = useMarkdownFile(filePath);
  const displayTitle = title || fileTitle;

  if (loading) {
    return (
      <View style={[styles.centerContainer, style]}>
        <ActivityIndicator animating={true} size="large" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Loading markdown content...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <Card style={[styles.errorCard, style]}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.errorTitle}>
            Error Loading Content
          </Text>
          <Text variant="bodyMedium" style={styles.errorMessage}>
            {error}
          </Text>
        </Card.Content>
      </Card>
    );
  }

  if (!content) {
    return (
      <Card style={[styles.errorCard, style]}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.errorTitle}>
            No Content Found
          </Text>
          <Text variant="bodyMedium">
            The requested markdown file could not be loaded.
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {displayTitle && (
        <Text variant="headlineMedium" style={styles.title}>
          {displayTitle}
        </Text>
      )}
      <MarkdownViewer content={content} style={styles.viewer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  errorCard: {
    margin: 16,
  },
  errorTitle: {
    marginBottom: 8,
    color: '#B3261E',
  },
  errorMessage: {
    color: '#666',
  },
  title: {
    marginBottom: 16,
    paddingHorizontal: 16,
    fontWeight: 'bold',
  },
  viewer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default MarkdownFileReader;