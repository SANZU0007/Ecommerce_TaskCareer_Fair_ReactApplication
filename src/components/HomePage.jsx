// src/HomePage.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function HomePage() {
    let [products, setProducts] = useState([])
    let [category, setCategory] = useState('All')
    let [itemName, setItemName] = useState('')
    let [price, setPrice] = useState()

    function loadProducts() {
        axios.get(process.env.REACT_APP_API_URL + "/api/products")
            .then((res) => {
                setProducts(res.data)
            }).catch(() => {

            })

        // if(category!='All'){
        //     setProducts(products.filter((x)=>{
        //         return 
        //     }))
        // }
    }
    useEffect(() => {
        loadProducts()
    }, [products, itemName,price])

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-blue-600 text-white flex justify-between p-4">
                <h1 className="text-3xl font-bold">My E-Commerce Store</h1>
                
            </header>
            <div className="flex space-x-4 items-center">
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                    <option value="All">All Categories</option>
                    <option value="Watch">Watch</option>
                    <option value="Sunglasses">Sunglasses</option>
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

                <input
                    type="number"
                    placeholder="Min Price"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
            </div>

            <main className="flex-grow p-6">
                <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div className="group p-2 relative bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
                            <img className="w-full object-cover rounded-t-lg" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDEcq9z0mM_CaTzeojSD_DIondtaatM6i-aQ&s"} alt={product.title} />
                            <div className="flex justify-between items-center bg-white">
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold">{product.title}</h2>
                                    <p className="text-gray-600 text-xl font-bold">₹{product.price.toFixed(2)}</p>
                                </div>
                                <button className="p-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                                    Add to Cart
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
