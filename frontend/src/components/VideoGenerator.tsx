import React, { useState } from 'react';
import { videoApi } from '../services/api';
import { CreateVideoRequest } from '../types/video';

interface VideoGeneratorProps {
  onVideoCreated: () => void;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({ onVideoCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(5);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError('プロンプトを入力してください');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: CreateVideoRequest = {
        prompt: prompt.trim(),
        duration,
        aspectRatio
      };

      await videoApi.generateVideo(request);
      setPrompt('');
      onVideoCreated();
    } catch (err: any) {
      setError(err.response?.data?.error || '動画生成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>動画生成</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="prompt" style={styles.label}>
            プロンプト
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="生成したい動画の内容を入力してください..."
            rows={4}
            style={styles.textarea}
            disabled={loading}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label htmlFor="duration" style={styles.label}>
              長さ (秒)
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min={1}
              max={10}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="aspectRatio" style={styles.label}>
              アスペクト比
            </label>
            <select
              id="aspectRatio"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              style={styles.select}
              disabled={loading}
            >
              <option value="16:9">16:9 (横長)</option>
              <option value="9:16">9:16 (縦長)</option>
              <option value="1:1">1:1 (正方形)</option>
            </select>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? '生成中...' : '動画を生成'}
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#555'
  },
  textarea: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  input: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  select: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  },
  row: {
    display: 'flex',
    gap: '16px'
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '14px'
  }
};
