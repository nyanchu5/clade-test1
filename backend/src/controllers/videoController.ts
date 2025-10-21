import { Request, Response } from 'express';
import { videoService } from '../services/videoService';
import path from 'path';
import fs from 'fs';

export class VideoController {
  async generateVideo(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, duration, aspectRatio } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ error: 'Prompt is required and must be a string' });
        return;
      }

      const video = await videoService.createVideo({
        prompt,
        duration,
        aspectRatio
      });

      res.status(201).json(video);
    } catch (error: any) {
      console.error('Error generating video:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getVideo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const video = await videoService.getVideo(id);

      if (!video) {
        res.status(404).json({ error: 'Video not found' });
        return;
      }

      res.json(video);
    } catch (error: any) {
      console.error('Error getting video:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getAllVideos(req: Request, res: Response): Promise<void> {
    try {
      const videos = await videoService.getAllVideos();
      res.json(videos);
    } catch (error: any) {
      console.error('Error getting videos:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteVideo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await videoService.deleteVideo(id);
      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting video:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async downloadVideo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const video = await videoService.getVideo(id);

      if (!video) {
        res.status(404).json({ error: 'Video not found' });
        return;
      }

      if (video.status !== 'completed') {
        res.status(400).json({ error: 'Video is not ready for download' });
        return;
      }

      const videosDir = process.env.VIDEOS_DIR || './videos';
      const videoPath = path.join(videosDir, `${id}.mp4`);

      if (!fs.existsSync(videoPath)) {
        res.status(404).json({ error: 'Video file not found' });
        return;
      }

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', `attachment; filename="${id}.mp4"`);

      const stream = fs.createReadStream(videoPath);
      stream.pipe(res);
    } catch (error: any) {
      console.error('Error downloading video:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export const videoController = new VideoController();
