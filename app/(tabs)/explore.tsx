import JScreen from '@/src/components/ui/JScreen';
import MarkdownFileList from '@/src/components/ui/MarkdownFileList';
import MarkdownFileReader from '@/src/components/ui/MarkdownFileReader';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function TabTwoScreen() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
  };

  const handleBackToList = () => {
    setSelectedFile(null);
  };

  return (
    <JScreen>
      {selectedFile ? (
        <View style={styles.viewerContainer}>
          <View style={styles.header}>
            <IconButton
              icon="arrow-left"
              onPress={handleBackToList}
              style={styles.backButton}
            />
          </View>
          <MarkdownFileReader filePath={selectedFile} />
        </View>
      ) : (
        <MarkdownFileList onFileSelect={handleFileSelect} />
      )}
    </JScreen>
  );
}

const styles = StyleSheet.create({
  viewerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  backButton: {
    marginRight: 8,
  },
});
