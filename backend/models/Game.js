import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  title: String,
  sport: String,
  venue: String,
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  maxPlayers: Number,
  players: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
    },
  ],
}, { timestamps: true });


const Game = mongoose.model("Game", gameSchema);
export default Game;