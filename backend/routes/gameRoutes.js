// backend/routes/gameRoutes.js
import express from 'express';
import { createGame, joinGame, getGames } from '../controllers/gameController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getGames);
router.post('/', protect, createGame);
router.post('/join/:id', protect, joinGame);


export default router;
