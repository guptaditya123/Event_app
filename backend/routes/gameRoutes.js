import express from "express";
import { createGame, joinGame, getGames } from "../controllers/gameController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createGame); // ✅ protect ensures req.user exists
router.get("/", getGames);             // anyone can see games
router.post("/join/:id", protect, joinGame);

export default router;
