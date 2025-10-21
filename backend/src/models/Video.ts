export interface Video {
  id: string;
  prompt: string;
  duration?: number;
  aspectRatio?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  errorMessage?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateVideoInput {
  prompt: string;
  duration?: number;
  aspectRatio?: string;
}

export interface UpdateVideoInput {
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  errorMessage?: string;
}
