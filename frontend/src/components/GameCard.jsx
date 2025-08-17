import { MapPin, Calendar, Clock, Users, User } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

const GameCard = ({ game = {}, onJoin, showNotification }) => {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  // ✅ Ensure players is always an array
  const [players, setPlayers] = useState(Array.isArray(game.players) ? game.players : []);
  const [joined, setJoined] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);

  // Update joined state if user already in players
  useEffect(() => {
    if (user && Array.isArray(players)) {
      setJoined(players.some((p) => p._id === user.id));
    }
  }, [user, players]);

  const handleJoin = async () => {
    if (!token) return showNotification("You must be logged in to join a game", "error");
    if (joined) return showNotification("You have already joined this game", "info");

    try {
      const response = await API.post(
        `/games/join/${game._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedPlayers = Array.isArray(response.data.game.players) ? response.data.game.players : [];
      setPlayers(updatedPlayers);
      setJoined(true);

      if (onJoin) onJoin(response.data.game); // update parent
      showNotification("Joined game successfully!", "success");
    } catch (error) {
      const msg = error.response?.data?.message;
      showNotification(msg || "Failed to join game", "error");
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }) : "TBD";

  const formatTime = (date) =>
    date ? new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "TBD";

  return (
    <div className="p-4 shadow-md rounded-2xl bg-white/80 backdrop-blur-md">
      <h2 className="text-xl font-semibold mb-2">{game.title || "Untitled Game"}</h2>

      <div className="space-y-2 text-gray-700">
        <p className="flex items-center gap-2"><MapPin size={16} /> {game.venue || "Unknown Venue"}</p>
        <p className="flex items-center gap-2"><Calendar size={16} /> {formatDate(game.startTime)}</p>
        <p className="flex items-center gap-2"><Clock size={16} /> {formatTime(game.startTime)} - {formatTime(game.endTime)}</p>
        <p className="flex items-center gap-2"><User size={16} /> Host: {game.host?.name || "Unknown"}</p>
        <p className="flex items-center gap-2"><Users size={16} /> Players: {players.length}/{game.maxPlayers || "N/A"}</p>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleJoin}
          disabled={joined}
          className={`px-4 py-2 rounded-lg font-bold text-white transition-all duration-300 ${joined ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {joined ? "Joined" : "Join"}
        </button>

        <button
          onClick={() => setShowPlayers(!showPlayers)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          {showPlayers ? "Hide Players" : "View Players"}
        </button>
      </div>

      {showPlayers && (
        <div className="mt-4 bg-white/20 p-3 rounded">
          {players.length > 0 ? (
            <ul className="list-disc list-inside text-gray-800">
              {players.map((player) => <li key={player._id}>{player.name}</li>)}
            </ul>
          ) : (
            <p className="text-gray-700">No players joined yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GameCard;
