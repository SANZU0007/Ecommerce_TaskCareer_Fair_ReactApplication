import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

export default function Signup() {
    const [role, setRole] = useState('user');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const navigate = useNavigate(); // To navigate to another route

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setInfo('');
        setLoading(true); // Show the loader when starting the request

        try {
            const response = await axios.post('https://ecommerceguviproject.onrender.com/auth/register', {
                role,
                username,
                email,
                password
            });
            console.log('Registering ', { role, username, email });
            
            // Assuming response.data has a message or status
            if (response.data.alreadyExists) {
                setInfo('Account already exists. Redirecting...');
                setTimeout(() => {
                    navigate('/'); // Navigate to home if account already exists
                }, 1500); // Delay to show the info message before navigating
            } else {
                setInfo('Registration successful!');
                setTimeout(() => {
                    navigate('/'); // Navigate to home after successful registration
                }, 1500);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setInfo('Registration failed. Please try again.');
        } finally {
            setLoading(false); // Hide the loader after the request
        }

        // Clear the input fields after submission
        setRole('user');
        setUsername('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Sign Up</h2>
                {info && <p className="mb-4 text-red-600">{info}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 flex items-center space-x-4">
                        <label className="block text-sm font-medium text-gray-600">Role:</label>
                        <div className='flex space-x-4'>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="admin"
                                    name="role"
                                    value="admin"
                                    checked={role === 'admin'}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="mr-2"
                                />
                                <label htmlFor="admin" className="text-sm text-gray-600">Admin</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="user"
                                    name="role"
                                    value="user"
                                    checked={role === 'user'}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="mr-2"
                                />
                                <label htmlFor="user" className="text-sm text-gray-600">User</label>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Username</label>
                        <input
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
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
                        className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        disabled={loading} // Disable button when loading
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                    </button>
                </form>
                <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already you have an account?{' '}
            <Link to="/" className="text-blue-600 hover:underline">
              login here
            </Link>
          </p>
        </div>
            </div>
        </div>
    );
}
