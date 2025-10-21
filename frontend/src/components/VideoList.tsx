import React from 'react';
import { Video } from '../types/video';
import { videoApi } from '../services/api';

interface VideoListProps {
  videos: Video[];
  onRefresh: () => void;
}

export const VideoList: React.FC<VideoListProps> = ({ videos, onRefresh }) => {
  const handleDelete = async (id: string) => {
    if (!confirm('この動画を削除してもよろしいですか？')) {
      return;
    }

    try {
      await videoApi.deleteVideo(id);
      onRefresh();
    } catch (err) {
      console.error('Failed to delete video:', err);
      alert('動画の削除に失敗しました');
    }
  };

  const getStatusText = (status: Video['status']): string => {
    switch (status) {
      case 'pending':
        return '待機中';
      case 'processing':
        return '生成中';
      case 'completed':
        return '完了';
      case 'failed':
        return '失敗';
    }
  };

  const getStatusColor = (status: Video['status']): string => {
    switch (status) {
      case 'pending':
        return '#ffa500';
      case 'processing':
        return '#007bff';
      case 'completed':
        return '#28a745';
      case 'failed':
        return '#dc3545';
    }
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('ja-JP');
  };

  if (videos.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>動画一覧</h2>
        <div style={styles.empty}>動画がまだありません</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>動画一覧</h2>
        <button onClick={onRefresh} style={styles.refreshButton}>
          更新
        </button>
      </div>

      <div style={styles.list}>
        {videos.map((video) => (
          <div key={video.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div
                style={{
                  ...styles.status,
                  backgroundColor: getStatusColor(video.status)
                }}
              >
                {getStatusText(video.status)}
              </div>
              <div style={styles.date}>{formatDate(video.createdAt)}</div>
            </div>

            <div style={styles.cardBody}>
              <div style={styles.prompt}>{video.prompt}</div>

              <div style={styles.metadata}>
                {video.duration && <span>長さ: {video.duration}秒</span>}
                {video.aspectRatio && <span>比率: {video.aspectRatio}</span>}
              </div>

              {video.errorMessage && (
                <div style={styles.errorMessage}>{video.errorMessage}</div>
              )}
            </div>

            <div style={styles.cardFooter}>
              {video.status === 'completed' && video.videoUrl && (
                <a
                  href={videoApi.getDownloadUrl(video.id)}
                  download
                  style={styles.downloadButton}
                >
                  ダウンロード
                </a>
              )}
              <button
                onClick={() => handleDelete(video.id)}
                style={styles.deleteButton}
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  },
  refreshButton: {
    backgroundColor: '#6c757d',
    color: '#fff',
    padding: '8px 16px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    transition: 'box-shadow 0.2s'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  status: {
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  date: {
    fontSize: '12px',
    color: '#888'
  },
  cardBody: {
    marginBottom: '12px'
  },
  prompt: {
    fontSize: '14px',
    color: '#333',
    marginBottom: '8px',
    lineHeight: '1.5'
  },
  metadata: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: '#666'
  },
  errorMessage: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '12px',
    marginTop: '8px'
  },
  cardFooter: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end'
  },
  downloadButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '8px 16px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '4px',
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'inline-block'
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '8px 16px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#888',
    fontSize: '16px'
  }
};
