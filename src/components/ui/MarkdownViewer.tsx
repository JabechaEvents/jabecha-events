import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from 'react-native-paper';

interface MarkdownViewerProps {
  content: string;
  style?: any;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, style }) => {
  const theme = useTheme();

  const markdownStyles = StyleSheet.create({
    // Headers
    heading1: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: 16,
      marginTop: 24,
    },
    heading2: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: 12,
      marginTop: 20,
    },
    heading3: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: 8,
      marginTop: 16,
    },
    heading4: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: 6,
      marginTop: 12,
    },
    heading5: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: 4,
      marginTop: 8,
    },
    heading6: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: 4,
      marginTop: 8,
    },
    
    // Text
    body: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.onSurface,
      marginBottom: 12,
    },
    paragraph: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.onSurface,
      marginBottom: 12,
    },
    
    // Emphasis
    strong: {
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    em: {
      fontStyle: 'italic',
      color: theme.colors.onSurface,
    },
    
    // Links
    link: {
      color: theme.colors.primary,
      textDecorationLine: 'underline',
    },
    
    // Lists
    list_item: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.onSurface,
      marginBottom: 4,
    },
    ordered_list: {
      marginBottom: 12,
    },
    bullet_list: {
      marginBottom: 12,
    },
    
    // Code
    code_inline: {
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.onSurfaceVariant,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: 14,
      fontFamily: 'monospace',
    },
    code_block: {
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.onSurfaceVariant,
      padding: 12,
      borderRadius: 8,
      fontSize: 14,
      fontFamily: 'monospace',
      marginBottom: 12,
    },
    fence: {
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.onSurfaceVariant,
      padding: 12,
      borderRadius: 8,
      fontSize: 14,
      fontFamily: 'monospace',
      marginBottom: 12,
    },
    
    // Blockquote
    blockquote: {
      backgroundColor: theme.colors.surfaceVariant,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      paddingLeft: 12,
      paddingRight: 12,
      paddingVertical: 8,
      marginBottom: 12,
      fontStyle: 'italic',
    },
    
    // Horizontal rule
    hr: {
      backgroundColor: theme.colors.outline,
      height: 1,
      marginVertical: 16,
    },
    
    // Table (if needed)
    table: {
      borderWidth: 1,
      borderColor: theme.colors.outline,
      marginBottom: 12,
    },
    thead: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    th: {
      padding: 8,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      fontWeight: 'bold',
    },
    td: {
      padding: 8,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
  });

  return (
    <ScrollView style={[styles.container, style]} showsVerticalScrollIndicator={false}>
      <Markdown style={markdownStyles}>{content}</Markdown>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MarkdownViewer;