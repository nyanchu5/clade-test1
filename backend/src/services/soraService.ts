import axios, { AxiosInstance } from 'axios';

export interface SoraGenerationRequest {
  prompt: string;
  duration?: number;
  aspectRatio?: string;
}

export interface SoraGenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

export class SoraService {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.SORA_API_KEY || '';
    const apiUrl = process.env.SORA_API_URL || 'https://api.sora.com/v2';

    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  async generateVideo(request: SoraGenerationRequest): Promise<SoraGenerationResponse> {
    try {
      const response = await this.client.post('/generate', {
        prompt: request.prompt,
        duration: request.duration || 5,
        aspect_ratio: request.aspectRatio || '16:9'
      });

      return {
        id: response.data.id,
        status: response.data.status,
        videoUrl: response.data.video_url,
        thumbnailUrl: response.data.thumbnail_url
      };
    } catch (error: any) {
      console.error('Sora API error:', error.response?.data || error.message);
      throw new Error(`Failed to generate video: ${error.response?.data?.message || error.message}`);
    }
  }

  async checkStatus(jobId: string): Promise<SoraGenerationResponse> {
    try {
      const response = await this.client.get(`/jobs/${jobId}`);

      return {
        id: response.data.id,
        status: response.data.status,
        videoUrl: response.data.video_url,
        thumbnailUrl: response.data.thumbnail_url,
        error: response.data.error
      };
    } catch (error: any) {
      console.error('Sora API error:', error.response?.data || error.message);
      throw new Error(`Failed to check status: ${error.response?.data?.message || error.message}`);
    }
  }

  async downloadVideo(videoUrl: string, outputPath: string): Promise<void> {
    try {
      const response = await axios.get(videoUrl, { responseType: 'stream' });
      const fs = require('fs');
      const writer = fs.createWriteStream(outputPath);

      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error: any) {
      console.error('Download error:', error.message);
      throw new Error(`Failed to download video: ${error.message}`);
    }
  }
}

export const soraService = new SoraService();
