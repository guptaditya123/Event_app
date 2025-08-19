import { useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    console.log('Frontend login attempt:', { email, password });

    const { data } = await API.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });

    console.log('Login response:', data);

    login({
      token: data.token,
      name: data.name,
      email: data.email,
      _id: data._id,
    });

    navigate('/dashboard');
  } catch (err) {
    console.error('Login error from API:', err.response?.data);
    setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4 sm:p-6">
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleLogin} 
          className="bg-white p-6 sm:p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
            Welcome Back
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="@email.iimcal.ac.in"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-md ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Signing In...' : 'Login'}
          </button>

          <div className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-medium text-green-600 hover:text-green-800 transition-colors"
            >
              Sign up here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
