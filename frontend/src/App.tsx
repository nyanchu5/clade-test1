import React, { useState, useEffect } from 'react';
import { VideoGenerator } from './components/VideoGenerator';
import { VideoList } from './components/VideoList';
import { videoApi } from './services/api';
import { Video } from './types/video';

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVideos = async () => {
    try {
      setError(null);
      const data = await videoApi.getAllVideos();
      setVideos(data);
    } catch (err: any) {
      setError('動画の読み込みに失敗しました');
      console.error('Failed to load videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      loadVideos();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.appTitle}>UGC Video Generator</h1>
        <p style={styles.subtitle}>Sora2 APIを使用した動画自動生成システム</p>
      </header>

      <main style={styles.main}>
        <VideoGenerator onVideoCreated={loadVideos} />

        {loading ? (
          <div style={styles.loading}>読み込み中...</div>
        ) : error ? (
          <div style={styles.error}>{error}</div>
        ) : (
          <VideoList videos={videos} onRefresh={loadVideos} />
        )}
      </main>

      <footer style={styles.footer}>
        <p>&copy; 2024 UGC Video Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
    padding: '24px',
    textAlign: 'center'
  },
  appTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0
  },
  main: {
    flex: 1,
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '24px'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '16px',
    borderRadius: '4px',
    textAlign: 'center'
  },
  footer: {
    backgroundColor: '#fff',
    borderTop: '1px solid #ddd',
    padding: '16px',
    textAlign: 'center',
    color: '#666',
    fontSize: '14px'
  }
};

export default App;
