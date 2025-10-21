import { Router } from 'express';
import { videoController } from '../controllers/videoController';

const router = Router();

router.post('/generate', (req, res) => videoController.generateVideo(req, res));
router.get('/', (req, res) => videoController.getAllVideos(req, res));
router.get('/:id', (req, res) => videoController.getVideo(req, res));
router.get('/:id/download', (req, res) => videoController.downloadVideo(req, res));
router.delete('/:id', (req, res) => videoController.deleteVideo(req, res));

export default router;
