
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Fab, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, CircularProgress } from '@mui/material'; // Floating action button

export default function AllProduct() {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('All');
    const [itemName, setItemName] = useState('');
    const [ogData, setOgData] = useState([]);
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(false); // Loading state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ image: '', title: '', description: '', price: 0, availableQuantity: 0, productType: '' });
    const navigate = useNavigate();

    // Load Products
    function loadProducts() {
        setLoading(true);
        axios.get(process.env.REACT_APP_API_URL + "/api/products", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            setProducts(res.data);
            setOgData(res.data);
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        loadProducts();
    }, []);

    // Filter Products
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
    }, [category, itemName, price]);

    // Handle Delete
    const handleDelete = (productId) => {
        setLoading(true);
        axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(() => {
            loadProducts(); // Reload products after deletion
        })
        .catch((error) => {
            console.error("Error deleting product:", error);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    // Handle Edit
    const handleEdit = (product) => {
        setFormData(product);
        setDialogOpen(true);
    };

    // Handle Add Product
    const handleAddProduct = () => {
        setFormData({ image: '', title: '', description: '', price: 0, availableQuantity: 0, productType: '' });
        setDialogOpen(true);
    };

    // Handle Dialog Close
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    // Handle Form Submit
    const handleFormSubmit = () => {
        setLoading(true);
        const apiCall = formData._id
            ? axios.put(`${process.env.REACT_APP_API_URL}/api/products/${formData._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            : axios.post(`${process.env.REACT_APP_API_URL}/api/products`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

        apiCall
            .then(() => {
                loadProducts(); // Reload products after adding or editing
                handleDialogClose(); // Close dialog after submission
            })
            .catch((error) => {
                console.error("Error saving product:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-blue-600 text-white flex justify-between p-4">
                <h1 className="text-3xl font-bold">My E-Commerce Store</h1>
                <button
                        onClick={() => navigate('/product')}
                        className="bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
                    >
                        back
                    </button>
            </header>
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
{/* 
                <input
                    type="number"
                    placeholder="Min Price"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                /> */}
            </div>

            <main className="flex-grow p-6">
                <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div key={product._id} className="group p-2 relative bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
                                <img className="w-full h-48 rounded-t-lg" src={product.image} alt={product.title} />
                                <div className="bg-white">
                                    <div className="p-4 flex space-x-2">
                                        <h2 className="text-lg font-semibold">{product.title}</h2>
                                        <p className="text-gray-600 text-xl font-bold">₹{product.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex justify-between p-2">
                                        <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-700">
                                            <EditIcon fontSize="large" />
                                        </button>
                                        <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-700">
                                            <DeleteIcon fontSize="large" />
                                        </button>
                                    </div>
                                    <button onClick={() => { navigate(`/product/${product._id}`) }} className="p-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                                        View Product
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            
            {/* Floating Add Button */}
            <Fab 
                color="primary" 
                aria-label="add" 
                onClick={handleAddProduct} 
                style={{ position: 'fixed', bottom: '10px', right: '10px' }}
            >
                <AddIcon />
            </Fab>

            {/* Dialog for Adding/Editing Product */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{formData._id ? 'Edit Product' : 'Add Product'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Image URL"
                        type="text"
                        fullWidth
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        type="number"
                        fullWidth
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    />
                    <TextField
                        margin="dense"
                        label="Available Quantity"
                        type="number"
                        fullWidth
                        value={formData.availableQuantity}
                        onChange={e => setFormData({ ...formData, availableQuantity: parseInt(e.target.value) })}
                    />
                    <Select
                        margin="dense"
                        label="Product Type"
                        fullWidth
                        value={formData.productType}
                        onChange={e => setFormData({ ...formData, productType: e.target.value })}
                    >
                        <MenuItem value="Electronics">Electronics</MenuItem>
                        <MenuItem value="Home Appliances">Home Appliances</MenuItem>
                        <MenuItem value="Backpack">Backpack</MenuItem>
                        <MenuItem value="Speaker">Speaker</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleFormSubmit} color="primary">
                        {loading ? <CircularProgress size={24} /> : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
