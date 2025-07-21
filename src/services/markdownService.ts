// Markdown Service
// This service provides markdown content for the app
// In a production app, you might fetch from an API or bundle files as assets

export interface MarkdownFile {
  path: string;
  title: string;
  content: string;
}

// Sample markdown content - in a real app, this could come from:
// 1. Bundled assets
// 2. API endpoints
// 3. Local storage
// 4. Cloud storage
const markdownFiles: Record<string, MarkdownFile> = {
  'sample.md': {
    path: 'sample.md',
    title: 'Sample Markdown',
    content: `# Sample Markdown Content

This is a **demo** of markdown rendering in the Jabecha Events app.

## Features

- ✅ **Bold** and *italic* text
- ✅ Headers (H1, H2, H3, etc.)
- ✅ Lists (bullet and numbered)
- ✅ Links and inline code
- ✅ Code blocks with syntax highlighting
- ✅ Blockquotes
- ✅ Tables
- ✅ Horizontal rules

### Code Example

\`\`\`javascript
const markdownContent = "# Hello World";
console.log(markdownContent);

// This is rendered beautifully in React Native
function renderMarkdown(content) {
  return <MarkdownViewer content={content} />;
}
\`\`\`

\`\`\`typescript
interface MarkdownProps {
  content: string;
  style?: StyleProp<ViewStyle>;
}

const MarkdownComponent: React.FC<MarkdownProps> = ({ content, style }) => {
  return <Markdown style={markdownStyles}>{content}</Markdown>;
};
\`\`\`

### Links and Navigation
[React Native Paper](https://reactnativepaper.com/) - Material Design for React Native
[Expo Documentation](https://docs.expo.dev/) - Learn about Expo framework

### Lists

#### Ordered Lists
1. First item with **bold text**
2. Second item with *italic text*
3. Third item with \`inline code\`
   - Nested unordered item
   - Another nested item with [a link](#)
4. Fourth item

#### Unordered Lists
- ✅ Task completed
- ⏳ Task in progress
- ❌ Task blocked
- 📝 Task notes
  - Sub-task 1
  - Sub-task 2

### Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Markdown Rendering | ✅ Complete | High |
| Theme Integration | ✅ Complete | High |
| Code Highlighting | ✅ Complete | Medium |
| Table Support | ✅ Complete | Low |

### Blockquotes

> This is a blockquote showing how important information can be highlighted in markdown content.
> 
> It supports **multiple lines** and *formatted text* as well.

> 💡 **Tip**: Use blockquotes for tips, warnings, or important notes in your content.

### Horizontal Rules

You can separate content sections with horizontal rules:

---

### Inline Formatting

You can use \`inline code\`, **bold text**, *italic text*, and ~~strikethrough~~ text within paragraphs.

The app supports a wide range of markdown features while maintaining the Material You design system from React Native Paper.

---

*This content was loaded using the MarkdownService and rendered with react-native-markdown-display.*`
  },
  
  'documentation.md': {
    path: 'documentation.md', 
    title: 'Documentation',
    content: `# Jabecha Events - Markdown Documentation

## Overview

This documentation explains how to use the markdown reading functionality in the Jabecha Events app.

## Components

### MarkdownViewer
Renders markdown content with custom styling that matches the app theme.

### MarkdownFileReader  
Combines file reading with the viewer component, includes loading and error states.

### useMarkdownFile Hook
Custom hook for loading markdown content with loading and error state management.

## Usage

\`\`\`typescript
import MarkdownFileReader from '@/src/components/ui/MarkdownFileReader';

function MyScreen() {
  return (
    <MarkdownFileReader 
      filePath="sample.md"
      title="My Content"
    />
  );
}
\`\`\`

## Supported Markdown Features

- Headers (H1-H6)
- Bold and italic text  
- Links
- Code blocks and inline code
- Lists (ordered and unordered)
- Blockquotes
- Tables
- Horizontal rules

## Theming

The markdown renderer uses the app's Material You theme colors:
- Primary color for links and emphasis
- Surface colors for code blocks
- Text colors that adapt to light/dark mode
`
  },

  'help.md': {
    path: 'help.md',
    title: 'Help & Support', 
    content: `# Help & Support

## Getting Started

Welcome to Jabecha Events! This app helps you manage funeral and event planning with African-style traditions in mind.

## Key Features

### 🎉 Event Management
- Create and manage events
- Upload photos and documents
- Generate PDF programs
- Share event details

### 🛒 Marketplace
- Find service providers
- Browse vendor listings
- Connect via WhatsApp
- Read reviews

### 📸 Gallery
- Upload event photos
- Create shared albums
- Download memories

## Need Help?

### Contact Support
- Email: support@jabechaevents.com
- WhatsApp: +1234567890
- Hours: 9 AM - 6 PM WAT

### FAQ

**Q: How do I create my first event?**
A: Tap the "+" button on the home screen and fill in the event details.

**Q: Can I share events with family members?**
A: Yes! Use the share button to send event links via WhatsApp or other apps.

**Q: How do I find vendors?**
A: Check the Marketplace tab to browse local service providers.

### Troubleshooting

If you experience issues:
1. Check your internet connection
2. Restart the app
3. Update to the latest version
4. Contact support if problems persist

---

Thank you for using Jabecha Events! 🙏
`
  }
};

export class MarkdownService {
  static async getMarkdownFile(filePath: string): Promise<MarkdownFile> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const file = markdownFiles[filePath];
    if (!file) {
      throw new Error(`Markdown file not found: ${filePath}`);
    }
    
    return file;
  }
  
  static getAvailableFiles(): string[] {
    return Object.keys(markdownFiles);
  }
  
  static async searchFiles(query: string): Promise<MarkdownFile[]> {
    const files = Object.values(markdownFiles);
    const lowercaseQuery = query.toLowerCase();
    
    return files.filter(file => 
      file.title.toLowerCase().includes(lowercaseQuery) ||
      file.content.toLowerCase().includes(lowercaseQuery)
    );
  }
}