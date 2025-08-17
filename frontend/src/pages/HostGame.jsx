import React, { useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const HostGame = () => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return (
      <div className="text-center text-red-500">
        You must be logged in to host a game.
      </div>
    );
  }
  console.log("User:", user);

  const [title, setTitle] = useState("");
  const [sport, setSport] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = user?.token || localStorage.getItem("token");
  console.log("Token:", token);

  const handleHost = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!date || !startTime || !endTime) {
        setError("Please select a valid date and time");
        setIsSubmitting(false);
        return;
      }

      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);

      if (isNaN(startDateTime) || isNaN(endDateTime)) {
        setError("Invalid date or time format");
        setIsSubmitting(false);
        return;
      }

      const gameData = {
        title,
        sport,
        venue,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        maxPlayers: Number(maxPlayers),
        host: { id: user._id, name: user.name }, // Add host info
        players: [], // Initially empty
      };

      await API.post("/games", gameData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Game hosted successfully!");

      // Reset form
      setTitle("");
      setSport("");
      setVenue("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setMaxPlayers("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-gray-900 bg-opacity-70 bg-blend-overlay"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute top-0 left-0 w-full">
        <Navbar />
      </div>

      <div className="relative mt-17 w-full max-w-2xl backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-white/20 animate-fadeIn z-10 bg-white/80">
        <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          Host a New Game
        </h2>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
            <div className="flex items-center text-red-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        <form onSubmit={handleHost} className="space-y-3">
          <div className="flex items-center py-3 px-2 rounded-lg bg-white border border-gray-200/50">
            <input
              type="text"
              value={user?.name || ""}
              readOnly
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
              placeholder="Host name"
            />
          </div>

          <input
            type="text"
            placeholder="Sport (e.g. Basketball, Soccer)"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white"
            required
          />

          <input
            type="text"
            placeholder="Venue (e.g. Main Sports Complex)"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white"
            required
          />

          {/* Improved date/time section for mobile */}
          <div className="space-y-3">
            {/* Date input remains the same */}
            <div className="w-full">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
                required
              />
            </div>

            {/* Time inputs with text pattern */}
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">
                  Start Time
                </label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="HH:MM (24h)"
                  pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">
                  End Time
                </label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="HH:MM (24h)"
                  pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
                  required
                />
              </div>
            </div>
          </div>

          <input
            type="number"
            placeholder="Max Players"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(e.target.value)}
            min="1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating Game..." : "Host Game"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HostGame;
