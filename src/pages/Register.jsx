import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import Logo from '../components/Logo';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Registration successful! Please login.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-gray-900 bg-white">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-navy">
        <div className="absolute inset-0 bg-brand-navy/60 z-10"></div>
        <img 
          src="/login_illustration.png" 
          alt="Cityscape" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative z-20 flex flex-col justify-center px-16 w-full text-white">
          <Logo size="lg" className="mb-8" />
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Make A Difference.<br/>Join SCRS.
          </h1>
          <p className="text-xl text-blue-100 max-w-md">
            Help us maintain the beauty of our city by reporting issues quickly and tracking progress.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md">
          <Logo size="md" className="lg:hidden mb-8" />
          <h2 className="text-3xl font-bold mb-2">Create an Account</h2>
          <p className="text-gray-500 mb-8">Sign up to start reporting issues.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all outline-none"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input 
                type="password" 
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all outline-none"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-6 bg-brand-orange text-white py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Already have an account? <Link to="/" className="text-brand-orange font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
