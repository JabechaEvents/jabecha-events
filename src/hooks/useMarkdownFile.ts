import { useEffect, useState } from 'react';
import { MarkdownFile, MarkdownService } from '../services/markdownService';

interface UseMarkdownFileReturn {
  content: string | null;
  title: string | null;
  loading: boolean;
  error: string | null;
}

export const useMarkdownFile = (filePath: string): UseMarkdownFileReturn => {
  const [content, setContent] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarkdownFile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const file: MarkdownFile = await MarkdownService.getMarkdownFile(filePath);
        setContent(file.content);
        setTitle(file.title);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load markdown file');
        setContent(null);
        setTitle(null);
      } finally {
        setLoading(false);
      }
    };

    if (filePath) {
      loadMarkdownFile();
    }
  }, [filePath]);

  return { content, title, loading, error };
};