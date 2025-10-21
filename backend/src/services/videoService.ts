import { v4 as uuidv4 } from 'uuid';
import { db } from '../models/database';
import { Video, CreateVideoInput, UpdateVideoInput } from '../models/Video';
import { soraService } from './soraService';
import path from 'path';
import fs from 'fs';

export class VideoService {
  async createVideo(input: CreateVideoInput): Promise<Video> {
    const id = uuidv4();
    const now = Date.now();

    const video: Video = {
      id,
      prompt: input.prompt,
      duration: input.duration,
      aspectRatio: input.aspectRatio,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };

    await db.run(
      `INSERT INTO videos (id, prompt, duration, aspectRatio, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, video.prompt, video.duration, video.aspectRatio, video.status, video.createdAt, video.updatedAt]
    );

    // Start generation process asynchronously
    this.processVideoGeneration(id).catch(err => {
      console.error(`Failed to process video ${id}:`, err);
    });

    return video;
  }

  async getVideo(id: string): Promise<Video | undefined> {
    return await db.get<Video>('SELECT * FROM videos WHERE id = ?', [id]);
  }

  async getAllVideos(): Promise<Video[]> {
    return await db.all<Video>('SELECT * FROM videos ORDER BY createdAt DESC');
  }

  async updateVideo(id: string, input: UpdateVideoInput): Promise<void> {
    const updates: string[] = [];
    const params: any[] = [];

    if (input.status) {
      updates.push('status = ?');
      params.push(input.status);
    }
    if (input.videoUrl) {
      updates.push('videoUrl = ?');
      params.push(input.videoUrl);
    }
    if (input.thumbnailUrl) {
      updates.push('thumbnailUrl = ?');
      params.push(input.thumbnailUrl);
    }
    if (input.errorMessage) {
      updates.push('errorMessage = ?');
      params.push(input.errorMessage);
    }

    updates.push('updatedAt = ?');
    params.push(Date.now());

    params.push(id);

    await db.run(
      `UPDATE videos SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
  }

  async deleteVideo(id: string): Promise<void> {
    await db.run('DELETE FROM videos WHERE id = ?', [id]);
  }

  private async processVideoGeneration(videoId: string): Promise<void> {
    try {
      const video = await this.getVideo(videoId);
      if (!video) {
        throw new Error('Video not found');
      }

      // Update status to processing
      await this.updateVideo(videoId, { status: 'processing' });

      // Generate video using Sora API
      const result = await soraService.generateVideo({
        prompt: video.prompt,
        duration: video.duration,
        aspectRatio: video.aspectRatio
      });

      // Poll for completion
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes with 5-second intervals

      while (attempts < maxAttempts) {
        const status = await soraService.checkStatus(result.id);

        if (status.status === 'completed') {
          // Download video to local storage
          const videosDir = process.env.VIDEOS_DIR || './videos';
          if (!fs.existsSync(videosDir)) {
            fs.mkdirSync(videosDir, { recursive: true });
          }

          const videoPath = path.join(videosDir, `${videoId}.mp4`);
          if (status.videoUrl) {
            await soraService.downloadVideo(status.videoUrl, videoPath);
          }

          await this.updateVideo(videoId, {
            status: 'completed',
            videoUrl: `/api/videos/${videoId}/download`,
            thumbnailUrl: status.thumbnailUrl
          });
          return;
        } else if (status.status === 'failed') {
          await this.updateVideo(videoId, {
            status: 'failed',
            errorMessage: status.error || 'Video generation failed'
          });
          return;
        }

        // Wait 5 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
      }

      // Timeout
      await this.updateVideo(videoId, {
        status: 'failed',
        errorMessage: 'Video generation timed out'
      });
    } catch (error: any) {
      console.error(`Error processing video ${videoId}:`, error);
      await this.updateVideo(videoId, {
        status: 'failed',
        errorMessage: error.message
      });
    }
  }
}

export const videoService = new VideoService();
