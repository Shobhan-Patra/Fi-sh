import Router from 'express';
import {
  checkRoomExistence,
  createRoom,
  joinRoom,
  leaveRoom,
} from '../controllers/room.js';
import { getDownloadUrl, getUploadUrl } from '../controllers/fileHandling.js';

const router = Router();

router.post('/', createRoom);
router.get('/check/:roomId', checkRoomExistence);
router.post('/:roomId', joinRoom);
router.post('/leave/:userId', leaveRoom);

router.post('/:roomId/files', getUploadUrl);
router.get('/:roomId/files', getDownloadUrl);

export default router;
