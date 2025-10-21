import axios from 'axios';
import { Video, CreateVideoRequest } from '../types/video';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const videoApi = {
  async generateVideo(request: CreateVideoRequest): Promise<Video> {
    const response = await api.post<Video>('/videos/generate', request);
    return response.data;
  },

  async getAllVideos(): Promise<Video[]> {
    const response = await api.get<Video[]>('/videos');
    return response.data;
  },

  async getVideo(id: string): Promise<Video> {
    const response = await api.get<Video>(`/videos/${id}`);
    return response.data;
  },

  async deleteVideo(id: string): Promise<void> {
    await api.delete(`/videos/${id}`);
  },

  getDownloadUrl(id: string): string {
    return `${API_BASE_URL}/videos/${id}/download`;
  }
};
