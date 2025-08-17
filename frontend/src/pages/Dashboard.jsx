import React, { useState, useEffect } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';
import GameCard from '../components/GameCard';

export default function Dashboard() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data } = await API.get('/games');

        const now = new Date();
        const upcoming = data
          .filter((g) => new Date(g.endTime) > now)
          .map((g) => ({
            ...g,
            players: Array.isArray(g.players) ? g.players : [],
          }));

        setGames(upcoming);
      } catch (err) {
        showNotification(err.response?.data?.message || 'Failed to load games', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Update a game after joining
  const handleJoinGame = (updatedGame) => {
    setGames((prev) =>
      prev.map((g) => (g._id === updatedGame._id ? { ...updatedGame, players: Array.isArray(updatedGame.players) ? updatedGame.players : [] } : g))
    );
    showNotification('Joined game successfully!', 'success');
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-opacity-90">
        <p className="text-lg text-white animate-pulse">Loading games...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-opacity-90">
        <p className="text-lg text-white bg-red-500/90 px-6 py-4 rounded-lg">{error}</p>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 bg-gray-900 bg-opacity-90 bg-blend-overlay">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in">
            <div
              className={`px-6 py-4 rounded-lg shadow-lg text-white flex items-center ${
                notification.type === 'error'
                  ? 'bg-red-500'
                  : notification.type === 'info'
                  ? 'bg-blue-500'
                  : 'bg-green-500'
              }`}
            >
              {notification.message}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              Upcoming Games
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300">
              Join or host your next sports event
            </p>
          </div>

          {games.length === 0 ? (
            <div className="text-center py-20 bg-white/10 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 max-w-2xl mx-auto">
              <h3 className="mt-4 text-lg font-medium text-white">No games scheduled</h3>
              <p className="mt-2 text-gray-300 max-w-md mx-auto">
                Be the first to host a game! Click 'Host Game' in the navigation to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {games.map((game) => (
                <GameCard
                  key={game._id}
                  game={game}
                  onJoin={handleJoinGame}
                  showNotification={showNotification}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
