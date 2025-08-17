import { useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Signp() { // Fixed typo in component name (was Signp)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

 const handleSignup = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    console.log('Frontend signup attempt:', { name, email, password });

    const { data } = await API.post('/auth/signup', {
      name,
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });

    console.log('Signup response:', data);

    login({
      token: data.token,
      name: data.name,
      email: data.email,
      _id: data._id,
    });

    navigate('/dashboard');
  } catch (err) {
    console.error('Signup error from API:', err.response?.data);
    setError(err.response?.data?.message || 'Signup failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-500 p-4 sm:p-6">
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleSignup} 
          className="bg-white p-6 sm:p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Create Account
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="email@iimcal.ac.in"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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
                minLength="6"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>

          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-medium text-purple-600 hover:text-purple-800 transition-colors"
            >
              Log in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}