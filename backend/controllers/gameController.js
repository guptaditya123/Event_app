// backend/controllers/gameController.js
import Game from "../models/Game.js";

export const createGame = async (req, res) => {
  const { title, sport, venue, startTime, endTime, maxPlayers } = req.body;

  try {
    // Convert to Date
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    }

    const conflict = await Game.findOne({
      venue,
      startTime: start,
    });

    if (conflict) {
      return res.status(400).json({ message: "Time slot already booked" });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const game = await Game.create({
      title: title || sport,
      sport,
      venue,
      startTime: start,
      endTime: end,
      host: req.user.id,
      maxPlayers,
      players: [], // <-- start empty
    });

    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const joinGame = async (req, res) => {
  const gameId = req.params.id;
  const userId = req.user.id;
  const userName = req.user.name;

  try {
    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    if (game.players.some((p) => p.user.toString() === userId)) {
      return res
        .status(400)
        .json({ message: "You have already joined this game" });
    }

    if (game.players.length >= game.maxPlayers) {
      return res.status(400).json({ message: "This game is already full" });
    }

    game.players.push({ user: userId, name: userName });
    await game.save();

    res.json({ message: "Joined game successfully", game });
  } catch (error) {
    console.error(error.response?.data);
    const msg = error.response?.data?.message || "Failed to join game";
    alert(msg);
  }
  s.status(500).json({ message: error.message });
};

export const getGames = async (req, res) => {
  try {
    const now = new Date(); // ✅ real Date object in UTC under the hood

    const games = await Game.find({
      endTime: { $gt: now },
    })
      .populate("host", "name email")
      .populate("players.user", "name")
      .sort({ startTime: 1 });

    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
