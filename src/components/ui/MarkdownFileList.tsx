import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, List, Text } from 'react-native-paper';
import { MarkdownService } from '../../services/markdownService';

interface MarkdownFileListProps {
  onFileSelect: (filePath: string) => void;
  style?: any;
}

export const MarkdownFileList: React.FC<MarkdownFileListProps> = ({ 
  onFileSelect, 
  style 
}) => {
  const availableFiles = MarkdownService.getAvailableFiles();

  const getFileInfo = (filePath: string) => {
    switch (filePath) {
      case 'sample.md':
        return {
          title: 'Sample Markdown',
          description: 'Demo showcasing all markdown features',
          icon: 'file-document'
        };
      case 'documentation.md':
        return {
          title: 'Documentation',
          description: 'How to use markdown in the app',
          icon: 'book-open'
        };
      case 'help.md':
        return {
          title: 'Help & Support',
          description: 'Get help and support information',
          icon: 'help-circle'
        };
      default:
        return {
          title: filePath,
          description: 'Markdown file',
          icon: 'file'
        };
    }
  };

  return (
    <ScrollView style={[styles.container, style]} showsVerticalScrollIndicator={false}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            📄 Markdown Files
          </Text>
          <Text variant="bodyMedium" style={styles.headerDescription}>
            Select a markdown file to view its content rendered with beautiful formatting.
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.fileList}>
        {availableFiles.map((filePath, index) => {
          const { title, description, icon } = getFileInfo(filePath);
          
          return (
            <View key={filePath}>
              <List.Item
                title={title}
                description={description}
                left={(props) => <List.Icon {...props} icon={icon} />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => onFileSelect(filePath)}
                style={styles.listItem}
              />
              {index < availableFiles.length - 1 && <Divider />}
            </View>
          );
        })}
      </View>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.infoTitle}>
            ✨ Features
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            • Beautiful markdown rendering{'\n'}
            • Theme-aware styling{'\n'}
            • Code syntax highlighting{'\n'}
            • Tables and lists support{'\n'}
            • Loading and error states
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  headerTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  headerDescription: {
    opacity: 0.7,
  },
  fileList: {
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  listItem: {
    paddingVertical: 8,
  },
  infoCard: {
    margin: 16,
    marginTop: 16,
  },
  infoTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  infoText: {
    lineHeight: 20,
  },
});

export default MarkdownFileList;