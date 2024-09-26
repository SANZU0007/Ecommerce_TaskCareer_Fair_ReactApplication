import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductPage() {
    const navigate = useNavigate()
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);

    useEffect(() => {
        // Fetch the product details using the ID
        axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`)
            .then((res) => {
                setProduct(res.data);
            }).catch(() => {
                // Handle error
            });
    }, [id]);

    if (!product) {
        return <p>Loading...</p>;
    }


   
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-blue-600 text-white flex justify-between p-4">
                <h1 className="text-3xl font-bold">{product.title}</h1>
                <button
                        onClick={() => navigate('/product')}
                        className="bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
                    >
                        Product Page
                    </button>
            </header>

            <main className="flex-grow p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex space-x-8">
                        {/* Product image */}
                        <img
                            src={product.image || "https://via.placeholder.com/400"}
                            alt={product.title}
                            className="h-96 w-1/2 rounded-lg"
                        />

                        {/* Product details */}
                        <div>
                            <h2 className="text-3xl font-semibold">{product.title}</h2>
                            <p className="text-xl text-red-600 font-bold font-[Cursive]">₹{product.price.toFixed(2)}</p>
                            <p className="mt-4 text-gray-800">{product.description}</p>

                            {/* Add to Cart Button */}
                            <button className="mt-6 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-blue-600 text-white text-center p-4">
                <p>&copy; 2024 My E-Commerce Store</p>
            </footer>
        </div>
    );
}
