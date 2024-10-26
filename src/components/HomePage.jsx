import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';

export default function HomePage() {
    
    let [products, setProducts] = useState([]);
    let [category, setCategory] = useState('All');
    let [itemName, setItemName] = useState('');

    
    let [ogData, setOgData] = useState([]);
    let [price, setPrice] = useState(0);
    let [isAdmin, setIsAdmin] = useState(false); // To track if the user is an admin
    let navigate = useNavigate();

    function loadProducts() {
        axios.get(process.env.REACT_APP_API_URL + "/api/products")
            .then((res) => {
                setProducts(res.data);
                setOgData(res.data);
            }).catch(() => {
                // Handle error
            });
    }

    useEffect(() => {
        loadProducts();

        // Check if the user in localStorage is admin
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'admin') {
            setIsAdmin(true);
        }
    }, []);

    useEffect(() => {
        let filteredProducts = ogData;

        // Filter by category
        if (category !== 'All') {
            filteredProducts = filteredProducts.filter((x) => x.productType === category);
        }

        // Filter by itemName (case-insensitive)
        if (itemName.trim() !== '') {
            filteredProducts = filteredProducts.filter((x) => 
                x.title.toLowerCase().includes(itemName.toLowerCase())
            );
        }

        // Filter by price
        if (price !== 0) {
            filteredProducts = filteredProducts.filter((x) => 
                Math.trunc(x.price) === parseInt(price)
            );
        }

        // Update the displayed products
        setProducts(filteredProducts);
    }, [category, itemName, price, ogData]);

    const handleLogout = () => {
        // Clear user data from local storage
        localStorage.removeItem('user');
        navigate('/'); // Redirect to home page
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <AppBar position="static" color="primary">
            <Toolbar className="flex justify-between">
                <Typography variant="h4" component="h1" className="font-bold">
                    My E-Commerce Store
                </Typography>
                <div className="flex items-center space-x-3">
                    {/* Conditionally render the Admin button */}
                    {isAdmin && (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => navigate('/admin')}
                            className="hover:bg-green-700 transition"
                        >
                            Admin Panel
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                        className="hover:bg-red-700 transition"
                    >
                        Logout
                    </Button>
                </div>
            </Toolbar>
        </AppBar>

            <div className="mt-4 ml-6 flex space-x-4 items-center">
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                    <option value="All">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Home Appliances">Home Appliances</option>
                    <option value="Backpack">Backpack</option>
                    <option value="Speaker">Speaker</option>
                </select>

                <input
                    type="text"
                    placeholder="Search..."
                    value={itemName}
                    onChange={e => setItemName(e.target.value)}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
            </div>

            <main className="flex-grow p-6">
                <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div key={product._id} className="group p-2 relative bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
                            <img className="w-full h-48 rounded-t-lg" src={product.image} alt={product.title} />
                            <div className="bg-white">
                                <div className="p-4 flex space-x-2">
                                    <h2 className="text-lg font-semibold">{product.title}</h2>
                                    <p className="text-gray-600 text-xl font-bold">₹{product.price.toFixed(2)}</p>
                                </div>
                                <button onClick={() => navigate(`/product/${product._id}`)} className="p-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                                    View Product
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="bg-blue-600 text-white text-center p-4">
                <p>&copy; 2024 My E-Commerce Store</p>
            </footer>
        </div>
    );
}
