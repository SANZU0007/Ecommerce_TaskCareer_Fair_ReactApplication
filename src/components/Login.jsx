import React, { useState } from 'react';
import 'animate.css';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response = await axios.post(process.env.REACT_APP_API_URL + "/auth/login", {
        email: email,
        password: password
      });

      console.log('Login successful', response.data);

      // Store user details and token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.data.email,
        username: response.data.username,
        role: response.data.role,
        id: response.data._id
      }));

     

      // Navigate to the product page after login
      navigate("/product");

    } catch (error) {
      setError("Wrong email or password");
      setTimeout(() => {
        setError('');
      }, 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-100 p-4">
      {/* Sample User Credentials Section */}
      <div className="w-full md:w-1/3 p-6 bg-gray-200 rounded-lg shadow-md mb-6 md:mb-0">
        <h3 className="text-lg font-bold text-gray-800">Sample User Credentials</h3>
        <div className="mt-4">
          <p className="text-sm text-gray-600">Email: <span className="font-semibold">demo007@gmail.com</span></p>
          <p className="text-sm text-gray-600">Password: <span className="font-semibold">93259325</span></p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>
        
        {error && (
          <p className="animate__animated animate__bounceInRight absolute top-5 right-5 bg-white mb-4 border-2 rounded-xl border-red-600 p-4 text-red-600 font-bold">
            <CancelIcon htmlColor='red' fontSize='large' />
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
