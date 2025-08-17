import { Link } from 'react-router-dom';
import heroImage from '../assets/here.jpg';

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-10 rounded-full animate-blob animate-delay-2000 mix-blend-overlay"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400 opacity-15 rounded-full animate-blob animate-delay-4000 mix-blend-overlay"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-400 opacity-15 rounded-full animate-blob animate-delay-6000 mix-blend-overlay"></div>

      {/* Main content container */}
      <div className="container mx-auto px-6 py-16 flex flex-col-reverse lg:flex-row items-center relative z-10">
        {/* Left Content */}
        <div className="text-white lg:w-1/2 animate-fadeInLeft">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Play, <span className="text-yellow-300">Connect</span> & Compete
          </h1>
          <p className="mb-8 text-lg md:text-xl text-blue-100 max-w-lg">
            Join or host games at your college venues easily. Track upcoming events and never miss out on the action!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/signup"
              className="bg-white text-purple-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl text-center"
            >
              Get Started
            </Link>
            
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="lg:w-1/2 mb-10 lg:mb-0 animate-fadeInRight relative">
          <div className="relative">
            <img 
              src={heroImage} 
              alt="College Games" 
              className="w-full rounded-2xl shadow-2xl border-4 border-white/20 transform rotate-1 hover:rotate-0 transition-transform duration-500" 
            />
            <div className="absolute -inset-4 bg-blue-400/20 rounded-2xl -z-10 animate-pulse-slow"></div>
          </div>
        </div>
      </div>

      {/* Floating animated elements */}
      <div className="absolute bottom-20 left-20 w-16 h-16 bg-yellow-300/20 rounded-full animate-float"></div>
      <div className="absolute top-1/3 right-40 w-8 h-8 bg-white/30 rounded-full animate-float-delay"></div>
    </div>
  );
}