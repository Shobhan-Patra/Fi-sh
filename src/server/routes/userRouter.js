import Router from 'express';
import { createUser, getRoomId } from '../controllers/user.js';

const router = Router();

router.post('/', createUser);
router.get('/current-room/:userId', getRoomId);

export default router;
