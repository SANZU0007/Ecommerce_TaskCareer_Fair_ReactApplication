import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';



import { AppBar, Toolbar, Typography,  IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Fab, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, CircularProgress } from '@mui/material';

export default function AllProduct() {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('All');
    const [itemName, setItemName] = useState('');
    const [ogData, setOgData] = useState([]);
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(false); // Loading state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({ image: '', title: '', description: '', price: 0, availableQuantity: 0, productType: '' });
    const [errors, setErrors] = useState({});
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
        setErrors({});
    };

    // Validate Form
    const validateForm = () => {
        let tempErrors = {};
        if (!formData.image) tempErrors.image = 'Image URL is required';
        if (!formData.title) tempErrors.title = 'Title is required';
        if (!formData.description) tempErrors.description = 'Description is required';
        if (!formData.price || formData.price <= 0) tempErrors.price = 'Valid price is required';
        if (!formData.availableQuantity || formData.availableQuantity < 0) tempErrors.availableQuantity = 'Valid quantity is required';
        if (!formData.productType) tempErrors.productType = 'Product type is required';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // Handle Form Submit
    const handleFormSubmit = () => {
        if (!validateForm()) return;

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
         <AppBar position="static" sx={{ background: 'linear-gradient(to right, #1976d2, #1565c0)' }}>
    <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            My E-Commerce Store
        </Typography>
        <Button
            onClick={() => navigate('/product')}
            variant="contained"
            color="secondary"
            startIcon={<ArrowBackIcon />}
            sx={{
                background: 'linear-gradient(to right, #4caf50, #388e3c)',
                color: 'white',
                boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                '&:hover': {
                    background: 'linear-gradient(to right, #66bb6a, #43a047)',
                },
            }}
        >
            Back
        </Button>
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
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        error={!!errors.image}
                        helperText={errors.image}
                    />
                    <TextField
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        error={!!errors.title}
                        helperText={errors.title}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        type="number"
                        fullWidth
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        error={!!errors.price}
                        helperText={errors.price}
                    />
                    <TextField
                        margin="dense"
                        label="Available Quantity"
                        type="number"
                        fullWidth
                        value={formData.availableQuantity}
                        onChange={(e) => setFormData({ ...formData, availableQuantity: parseInt(e.target.value) })}
                        error={!!errors.availableQuantity}
                        helperText={errors.availableQuantity}
                    />
                    <Select
                        value={formData.productType}
                        fullWidth
                        onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                        error={!!errors.productType}
                    >
                        <MenuItem value=""><em>Select Product Type</em></MenuItem>
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
                    <Button onClick={handleFormSubmit} color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
