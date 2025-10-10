import Router from 'express';
import { createRoom, joinRoom, leaveRoom } from '../controllers/room.js';
import { getDownloadUrl, getUploadUrl } from '../controllers/fileHandling.js';

const router = Router();

router.post('/', createRoom);
router.post('/:roomId', joinRoom);
router.post('/leave/:userId', leaveRoom);

router.post('/:roomId/files', getUploadUrl);
router.get('/:roomId/files', getDownloadUrl);

export default router;
