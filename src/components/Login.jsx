import React, { useState } from 'react'
import 'animate.css'
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const navigate = useNavigate()
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add your authentication logic here
    try {
      let response = await axios.post(process.env.REACT_APP_API_URL+"/auth/login",{
        email:email,
        password
      })
      console.log(response);
      document.cookie = `user_token=${response['data']['token']}`
      console.log(document.cookie);
      // Example of login logic
      console.log('Logging in with', { email, password });
      
      // Clear the input fields after submission
      setError('');
      setEmail('');
      setPassword('');
      navigate("/")
    } catch (error) {
      setError("Wrong email or password")
      setTimeout(() => {
        setError('')
      }, 2500);
    }

    // Reset error message if input is valid
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>
        {error && <p className="animate__animated animate__bounceInRight absolute top-5 right-5 bg-white mb-4 border-2 rounded-xl border-red-600 p-4 text-red-600 font-bold">
            <CancelIcon htmlColor='red' fontSize='large'/>
            {error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Password:
            </label>
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
            className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}


